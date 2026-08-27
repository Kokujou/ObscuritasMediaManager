import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { FileClient, MusicClient, MusicModel, PlaylistClient } from '../../obscuritas-media-manager-backend-client';
import { AuthenticatedRequestService } from '../../services/authenticated-request.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { OfflineMusicCache } from '../offline-music.cache';
import { SessionRecorder } from '../session-recorder';
import { OfflineSession } from '../session';
import { renderOfflineMusicImportPageStyles } from './offline-music-import-page.css';
import { renderOfflineMusicImportPage } from './offline-music-import-page.html';

const BackendUrl = '../Backend';
const ImportedMarkerKey = 'offline-music.imported-at';
/**
 * Bump by hand when shipping. dist/bundle.js is gitignored, so a commit alone changes nothing
 * about what is served - this is the only way to tell from the device which build is live.
 */
const BuildMarker = '2026-08-27 keepalive+recorder';

@customElement('offline-music-import-page')
export class OfflineMusicImportPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Musik importieren';

    static override get styles() {
        return renderOfflineMusicImportPageStyles();
    }

    @state() declare protected musicTotal?: number;
    @state() declare protected playlistsTotal?: number;
    @state() declare protected instrumentsTotal?: number;

    @state() declare protected musicMetadataImported: number;
    @state() declare protected musicImported: number;
    @state() declare protected playlistsImported: number;
    @state() declare protected instrumentsImported: number;
    @state() declare protected validating: number;

    @state() declare protected databaseConsistent: boolean;
    @state() declare protected importing: boolean;
    @state() declare protected loading: boolean;
    @state() declare protected isCached: boolean;
    @state() declare protected cacheDate: Date | null;
    @state() declare protected diagnosticsExpanded: boolean;

    protected requestService = new AuthenticatedRequestService();
    protected MusicService = new MusicClient(BackendUrl, this.requestService);
    protected PlaylistService = new PlaylistClient(BackendUrl, this.requestService);
    protected FileService = new FileClient(BackendUrl, this.requestService);

    get offlineMode() {
        return !this.musicTotal || !this.playlistsTotal || !this.instrumentsTotal;
    }

    /**
     * An import that once succeeded but has no data left. On iOS the service worker and Cache
     * Storage are shared with the Safari tab while IndexedDB is not, and ITP evicts script-writable
     * storage on its own - both leave the shell loading with an empty library, which is otherwise
     * indistinguishable from never having imported at all.
     */
    get archiveLost() {
        return !!localStorage.getItem(ImportedMarkerKey) && this.musicImported == 0 && this.musicMetadataImported == 0;
    }

    constructor() {
        super();
        this.musicImported = 0;
        this.musicMetadataImported = 0;
        this.playlistsImported = 0;
        this.instrumentsImported = 0;
        this.validating = 0;

        document.addEventListener('login', () => location.assign('../#login'));
    }

    async connectedCallback() {
        super.connectedCallback();

        this.loading = true;
        this.isCached = await caches.has('offline-music-v1');
        this.cacheDate = OfflineMusicCache.lastUpdated;
        await this.loadData();
        this.loading = false;

        document.body.querySelector('loading-screen')?.remove();

        this.requestFullUpdate();
    }

    async loadData() {
        await OfflineSession.initialize();

        try {
            const overview = await this.MusicService.getOverview();
            this.musicTotal = overview.tracks;
            this.playlistsTotal = overview.playlists;
            this.instrumentsTotal = overview.instruments;
        } catch {}

        this.musicMetadataImported = OfflineSession.musicMetadata.length;
        this.playlistsImported = OfflineSession.playlists.length;
        this.instrumentsImported = OfflineSession.instruments.length;
        this.musicImported = OfflineSession.trackHashes.length;

        // >=, not ==: an offline archive may hold tracks the backend no longer offers, and that
        // is not an inconsistency to be repaired by re-importing.
        this.databaseConsistent =
            this.musicMetadataImported >= (this.musicTotal ?? 0) &&
            this.musicImported >= (this.musicTotal ?? 0) &&
            this.playlistsImported >= (this.playlistsTotal ?? 0) &&
            this.instrumentsImported >= (this.instrumentsTotal ?? 0);
    }

    async importData() {
        if (this.offlineMode) throw new Error('Application is offline, data cannot be imported.');

        this.importing = true;
        this.requestFullUpdate();

        // Screen Wake Lock is unsupported on iOS and can be refused everywhere else. It used to
        // sit above the try, so a refusal aborted the whole import without any feedback.
        let wakeLock: WakeLockSentinel | null = null;
        try {
            wakeLock = navigator.wakeLock ? await navigator.wakeLock.request('screen') : null;
        } catch (ex) {
            console.warn('screen wake lock unavailable, the import continues', ex);
        }

        try {
            let database = await OfflineSession.openDatabase();
            database = await this.createSchema(database);
            try {
                await this.downloadData(database);
            } finally {
                database.close();
            }
            // the stores changed under us, and initialize() is memoised - re-read before counting
            await OfflineSession.reload();
            await this.loadData();
            if (this.musicImported > 0) localStorage.setItem(ImportedMarkerKey, Date.now().toString());
        } catch (ex) {
            console.error(ex);
            alert('error while importing files: ' + ((ex as Error)?.message ?? JSON.stringify(ex)));
        } finally {
            this.importing = false;
            try {
                await wakeLock?.release();
            } catch {}
            this.requestFullUpdate();
        }
    }

    async downloadData(database: IDBDatabase) {
        await this.loadData();
        const promises = [];
        const subscriptions = [];

        if (this.playlistsImported < this.playlistsTotal!) {
            this.playlistsImported = 0;
            const playlists = await this.PlaylistService.listPlaylists();
            const playlistsImport = database.import(OfflineSession.PlaylistsStoreName, playlists, (x) => x.id);
            subscriptions.push(playlistsImport.progress.subscribe(() => this.playlistsImported++));
            promises.push(playlistsImport.completed);
        }

        if (this.instrumentsImported < this.instrumentsTotal!) {
            this.instrumentsImported = 0;
            const instruments = await this.MusicService.getInstruments();
            const instrumentsImport = database.import(OfflineSession.InstrumentsStoreName, instruments, (x) => x.id);
            subscriptions.push(instrumentsImport.progress.subscribe(() => this.instrumentsImported++));
            promises.push(instrumentsImport.completed);
        }

        if (this.musicMetadataImported < this.musicTotal! || this.musicImported < this.musicTotal!) {
            const music = await this.MusicService.getAll();
            if (!(await this.confirmBackendIdentity(music))) throw new Error('import cancelled: unknown library');

            if (this.musicMetadataImported < this.musicTotal!) {
                this.musicMetadataImported = 0;
                const metadataImport = database.import(OfflineSession.MusicMetadataStoreName, music, (x) => x.hash);
                subscriptions.push(metadataImport.progress.subscribe(() => this.musicMetadataImported++));
                promises.push(metadataImport.completed);
            }

            if (this.musicImported < this.musicTotal!) promises.push(this.importMusic(music, database));
        }

        try {
            await Promise.all(promises);
        } finally {
            subscriptions.forEach((x) => x.unsubscribe());
        }
    }

    /**
     * The backend is addressed relatively, so a different device answering on the same address in
     * a different network looks identical from here. Compare the offered library against the local
     * archive: no overlap at all means this is somebody else's library, not an update of ours.
     */
    private async confirmBackendIdentity(offered: MusicModel[]) {
        const local = new Set(OfflineSession.trackHashes);
        if (local.size == 0 || offered.length == 0) return true;

        const overlap = offered.filter((track) => local.has(track.hash)).length;
        if (overlap > 0) return true;

        return await DialogBase.show('Unbekannte Bibliothek', {
            content:
                `Der erreichbare Server bietet ${offered.length} Tracks an, von denen keiner ` +
                `zu den ${local.size} lokal gespeicherten passt.\r\n` +
                'Das ist wahrscheinlich ein anderes Gerät und nicht dein Server.\r\n' +
                'Trotzdem importieren? Vorhandene Dateien bleiben erhalten.',
            acceptActionText: 'Importieren',
            declineActionText: 'Abbrechen',
            noImplicitAccept: true,
            showBorder: true,
        });
    }

    async importMusic(metadata: MusicModel[], database: IDBDatabase) {
        const failed: string[] = [];
        for (const track of metadata) {
            if (await database.getItemByKey(OfflineSession.MusicStoreName, track.hash)) continue;

            // One unreachable or unstorable track must not abandon the rest of the library.
            try {
                const result = await this.FileService.getAudio(track.path, true);
                if (!result?.data) throw new Error('empty response');

                await database.add(OfflineSession.MusicStoreName, result.data, track.hash);
                this.musicImported++;
            } catch (error) {
                console.error('track could not be imported: ' + (track.displayName ?? track.name), error);
                failed.push(track.displayName ?? track.name);
            }

            this.requestFullUpdate();
        }

        if (failed.length)
            alert(
                failed.length + ' of ' + metadata.length + ' tracks could not be imported: ' + failed.slice(0, 20).join(', '),
            );
    }

    /**
     * Brings the schema up to date without ever dropping the database. A missing object store is
     * added through a version bump, which leaves every existing store - and the imported audio in
     * particular - untouched. The previous implementation deleted the whole database instead.
     */
    async createSchema(database: IDBDatabase | null) {
        const missing = database
            ? OfflineSession.StoreNames.filter((storeName) => !database.objectStoreNames.contains(storeName))
            : OfflineSession.StoreNames;
        database?.close();

        if (database && missing.length) console.warn('adding missing object stores: ' + missing.join(', '));

        return await IndexedDbService.createDatabase(
            OfflineSession.DbName,
            OfflineSession.DbVersion,
            ...OfflineSession.StoreNames,
        );
    }

    async deleteMusicCache() {
        const confirmed = await DialogBase.show('Bist du sicher?', {
            content:
                'Dieser Vorgang löscht eine große Menge an Daten.\r\nDies kann nicht rückgängig gemacht werden.\r\nBist du sicher?',
            acceptActionText: 'Ja',
            declineActionText: 'Nein',
            noImplicitAccept: true,
            showBorder: true,
        });
        if (!confirmed) return;

        await this.deleteContainer(OfflineSession.MusicStoreName);
        OfflineSession.trackHashes = [];
        this.musicImported = 0;
        this.databaseConsistent = false;
        this.requestFullUpdate();
    }

    async deleteMusicMetadata() {
        if (
            !(await this.confirmDeletion(
                'Metadaten löschen?',
                'Ohne Metadaten sind die gespeicherten Audiodateien nicht mehr auffindbar und müssen neu importiert werden.',
            ))
        )
            return;

        await this.deleteContainer(OfflineSession.MusicMetadataStoreName);
        OfflineSession.musicMetadata = [];
        this.requestFullUpdate();
        this.musicMetadataImported = 0;
    }

    async deletePlaylists() {
        if (!(await this.confirmDeletion('Playlists löschen?', 'Die gespeicherten Playlists werden entfernt.'))) return;

        await this.deleteContainer(OfflineSession.PlaylistsStoreName);
        OfflineSession.playlists = [];
        OfflineSession.clearTemporaryPlaylists();
        this.playlistsImported = 0;
    }

    async deleteInstruments() {
        if (!(await this.confirmDeletion('Instrumente löschen?', 'Die gespeicherten Instrumente werden entfernt.'))) return;

        await this.deleteContainer(OfflineSession.InstrumentsStoreName);
        OfflineSession.instruments = [];
        this.instrumentsImported = 0;
    }

    private confirmDeletion(title: string, content: string) {
        return DialogBase.show(title, {
            content: content + '\r\nFortfahren?',
            acceptActionText: 'Löschen',
            declineActionText: 'Abbrechen',
            noImplicitAccept: true,
            showBorder: true,
        });
    }

    get buildMarker() {
        return BuildMarker;
    }

    get recorderEnabled() {
        return SessionRecorder.enabled;
    }

    get keepSessionAlive() {
        return OfflineSession.audio?.keepSessionAlive ?? false;
    }

    get sessionLog() {
        return SessionRecorder.read();
    }

    get sessionLogGaps() {
        return SessionRecorder.gaps.length;
    }

    setRecorderEnabled(enabled: boolean) {
        SessionRecorder.enabled = enabled;
        this.requestFullUpdate();
    }

    setKeepSessionAlive(enabled: boolean) {
        if (OfflineSession.audio) OfflineSession.audio.keepSessionAlive = enabled;
        this.requestFullUpdate();
    }

    clearSessionLog() {
        SessionRecorder.clear();
        this.requestFullUpdate();
    }

    async copySessionLog() {
        try {
            await navigator.clipboard.writeText(SessionRecorder.asText());
        } catch {
            alert('Die Zwischenablage ist nicht verfügbar. Das Log lässt sich unten markieren.');
        }
    }

    async deleteContainer(storeName: string) {
        let database = await OfflineSession.openDatabase();
        if (!database) throw new Error('database not found');

        try {
            await database.clearStore(storeName);
        } finally {
            database.close();
        }

        await OfflineSession.reload();
        await this.loadData();
        this.requestFullUpdate();
    }

    async clearServiceCache() {
        this.importing = true;
        await OfflineMusicCache.deleteCache();
        location.reload();
    }

    override render() {
        return renderOfflineMusicImportPage.call(this);
    }

    async validateMusicCache(event: Event) {
        this.loading = true;

        const failedTracks: [MusicModel, string][] = [];
        for (let track of OfflineSession.musicMetadata) {
            this.validating++;
            if (!OfflineSession.trackHashes.includes(track?.hash)) {
                failedTracks.push([track, 'not cached']);
                continue;
            }

            try {
                await OfflineSession.playTrack(track, false, false);
            } catch (err) {
                failedTracks.push([track, (err as Error)?.message ?? String(err)]);
            }
            this.requestFullUpdate();
        }

        if (failedTracks.length >= OfflineSession.musicMetadata.length)
            await DialogBase.show('Cache corrupt', {
                content: 'Sämtliche Tracks sind fehlerhaft. Bitte baue den Cache neu auf.',
            });
        else if (failedTracks.length == 0)
            await DialogBase.show('Alle Tracks gültig!', { content: 'Alle Tracks konnten erfolgreich validiert werden.' });
        else {
            const shouldDelete = await DialogBase.show('Fehler gefunden', {
                content:
                    'Die folgenden Tracks sind fehlerhaft: \n' +
                    failedTracks.map((x) => x[0].displayName.replace('\n', '') + '-' + JSON.stringify(x[1])).join('\r\n'),
                acceptActionText: 'Löschen',
                declineActionText: 'Schließen',
            });
            if (shouldDelete) {
                for (let track of failedTracks) {
                    let database = await OfflineSession.openDatabase();
                    database?.delete(OfflineSession.MusicStoreName, track[0].hash);
                    OfflineSession.trackHashes = OfflineSession.trackHashes.filter((x) => x != track[0].hash);
                    this.musicImported--;
                    this.databaseConsistent = false;
                    this.requestFullUpdate();
                }
            }
        }
        this.validating = 0;
        this.loading = false;
    }
}
