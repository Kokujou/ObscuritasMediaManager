import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { FileClient, MusicClient, MusicModel, PlaylistClient } from '../../obscuritas-media-manager-backend-client';
import { AuthenticatedRequestService } from '../../services/authenticated-request.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { OfflineSession } from '../session';
import { renderOfflineMusicImportPageStyles } from './offline-music-import-page.css';
import { renderOfflineMusicImportPage } from './offline-music-import-page.html';

const BackendUrl = '../Backend';

@customElement('offline-music-import-page')
export class OfflineMusicImportPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Musik importieren';

    static override get styles() {
        return renderOfflineMusicImportPageStyles();
    }

    static async checkDataExists(database: IDBDatabase | null) {
        if (!database) return false;

        if (OfflineSession.StoreNames.some((storeName) => !database.objectStoreNames.contains(storeName))) return false;

        const musicMetadataImported = await database.countStore(OfflineSession.MusicMetadataStoreName);
        if (musicMetadataImported <= 0) return false;
        const instrumentsImported = await database.countStore(OfflineSession.InstrumentsStoreName);
        if (instrumentsImported <= 0) return false;
        const musicImported = await database.countStore(OfflineSession.MusicStoreName);
        if (musicImported <= 0) return false;

        return true;
    }

    @state() protected declare musicTotal?: number;
    @state() protected declare playlistsTotal?: number;
    @state() protected declare instrumentsTotal?: number;

    @state() protected declare musicMetadataImported: number;
    @state() protected declare musicImported: number;
    @state() protected declare playlistsImported: number;
    @state() protected declare instrumentsImported: number;

    @state() protected declare databaseConsistent: boolean;
    @state() protected declare importing: boolean;
    @state() protected declare loading: boolean;

    protected requestService = new AuthenticatedRequestService();
    protected MusicService = new MusicClient(BackendUrl, this.requestService);
    protected PlaylistService = new PlaylistClient(BackendUrl, this.requestService);
    protected FileService = new FileClient(BackendUrl, this.requestService);

    get offlineMode() {
        return !this.musicTotal || !this.playlistsTotal || !this.instrumentsTotal;
    }

    constructor() {
        super();
        this.musicImported = 0;
        this.musicMetadataImported = 0;
        this.playlistsImported = 0;
        this.instrumentsImported = 0;

        document.addEventListener('login', () => location.assign('../#login'));
    }

    async connectedCallback() {
        super.connectedCallback();

        this.loading = true;
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
        this.musicImported = OfflineSession.trackUrls.length;

        this.databaseConsistent =
            this.musicMetadataImported == this.musicTotal &&
            this.musicImported == this.musicTotal &&
            this.playlistsImported == this.playlistsTotal &&
            this.instrumentsImported == this.instrumentsTotal;
    }

    async importData() {
        if (this.offlineMode) throw new Error('Application is offline, data cannot be imported.');

        const wakeLock = navigator.wakeLock ? await navigator.wakeLock.request('screen') : null;

        this.importing = true;
        try {
            let database = await OfflineSession.openDatabase();
            database = await this.createSchema(database);
            await this.downloadData(database);
            database.close();
            this.databaseConsistent = true;
        } catch (ex) {
            console.error(ex);
            alert('error while importing files:' + JSON.stringify(ex));
        }
        this.importing = false;
        if (wakeLock) await wakeLock?.release();
    }

    async downloadData(database: IDBDatabase) {
        await this.loadData();
        const promises = [];
        const subscriptions = [];

        if (this.playlistsImported < this.playlistsTotal!) {
            this.playlistsImported = 0;
            const playlists = await this.PlaylistService.listPlaylists();
            const playlistsObservable = database.import(OfflineSession.PlaylistsStoreName, playlists, (x) => x.id);
            subscriptions.push(playlistsObservable.subscribe(() => this.playlistsImported++));
            promises.push(playlistsObservable.toPromise());
        }

        if (this.instrumentsImported < this.instrumentsTotal!) {
            this.instrumentsImported = 0;
            const instruments = await this.MusicService.getInstruments();
            const instrumentsObservable = database.import(OfflineSession.InstrumentsStoreName, instruments, (x) => x.id);
            subscriptions.push(instrumentsObservable.subscribe(() => this.instrumentsImported++));
            promises.push(instrumentsObservable.toPromise());
        }

        if (this.musicMetadataImported < this.musicTotal! || this.musicImported < this.musicTotal!) {
            const music = await this.MusicService.getAll();

            if (this.musicMetadataImported < this.musicTotal!) {
                this.musicMetadataImported = 0;
                const musicObservable = database.import(OfflineSession.MusicMetadataStoreName, music, (x) => x.hash);
                subscriptions.push(musicObservable.subscribe(() => this.musicMetadataImported++));
                promises.push(musicObservable.toPromise());
            }

            if (this.musicImported < this.musicTotal!) promises.push(this.importMusic(music, database));
        }

        await Promise.all(promises);
        subscriptions.forEach((x) => x.unsubscribe());
    }

    async importMusic(metadata: MusicModel[], database: IDBDatabase) {
        let errors = 0;
        for (const track of metadata) {
            if (await database.getItemByKey(OfflineSession.MusicStoreName, track.hash)) continue;

            var result = await this.FileService.getAudio(track.path, true);
            if (!result) {
                console.error('track could not be imported: ' + track.name);
                errors++;
                continue;
            }

            database.add(OfflineSession.MusicStoreName, result.data, track.hash);
            this.musicImported++;
        }

        if (errors > 0) alert('Errors occurred while importing tracks');
    }

    async createSchema(database: IDBDatabase | null) {
        if (database && !OfflineSession.StoreNames.every((storeName) => database!.objectStoreNames.contains(storeName))) {
            console.error('database exists, but has invalid schema, recreating');
            database.close();

            const confirmed = await DialogBase.show('Datenbank inkonsistent', {
                content:
                    'Die Datenbank hat das falsche Schema und muss neu erstellt werden.\r\n' +
                    'Dadurch werden sämtliche Daten gelöscht und müssen neu importiert werden.\r\n' +
                    'Fortfahren?',
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
                noImplicitAccept: true,
            });
            if (!confirmed) throw new Error('Database inconsistent');

            await IndexedDbService.deleteDatabase(OfflineSession.DbName);
            database = null;
        }

        if (!database)
            database = await IndexedDbService.createDatabase(
                OfflineSession.DbName,
                OfflineSession.DbVersion,
                ...OfflineSession.StoreNames
            );

        return database;
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
    }

    async deleteMusicMetadata() {
        await this.deleteContainer(OfflineSession.MusicMetadataStoreName);
        OfflineSession.musicMetadata = [];
        this.requestFullUpdate();
        this.musicMetadataImported = 0;
    }

    async deletePlaylists() {
        await this.deleteContainer(OfflineSession.PlaylistsStoreName);
        OfflineSession.playlists = [];
        OfflineSession.temporaryPlaylists = {};
        this.playlistsImported = 0;
    }

    async deleteInstruments() {
        await this.deleteContainer(OfflineSession.InstrumentsStoreName);
        OfflineSession.instruments = [];
        this.instrumentsImported = 0;
    }

    async deleteContainer(storeName: string) {
        let database = await OfflineSession.openDatabase();
        if (!database) throw new Error('database not found');

        await database.clearStore(storeName);

        database.close();
    }

    async clearServiceCache() {
        this.importing = true;
        await caches.delete('v1');
        location.assign('../');
        this.importing = false;
    }

    override render() {
        return renderOfflineMusicImportPage.call(this);
    }
}
