import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { FileClient, MusicClient, MusicModel, PlaylistClient } from '../../obscuritas-media-manager-backend-client';
import { AuthenticatedRequestService } from '../../services/authenticated-request.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { MusicCache, OfflineMusicPage } from '../offline-music-page/offline-music-page';
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

        if (OfflineMusicPage.StoreNames.some((storeName) => !database.objectStoreNames.contains(storeName))) return false;

        const musicMetadataImported = await database.countStore(OfflineMusicPage.MusicStoreName);
        if (musicMetadataImported <= 0) return false;
        const instrumentsImported = await database.countStore(OfflineMusicPage.InstrumentsStoreName);
        if (instrumentsImported <= 0) return false;

        const firstTrack = (await database.getStoreCursor(OfflineMusicPage.MusicStoreName))?.value! as MusicModel;
        if (!(await MusicCache.match(OfflineMusicPage.CacheKey(firstTrack.hash)))) return false;

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

        const wakeLock = await navigator.wakeLock.request('screen');
        this.importing = true;
        try {
            let database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
            database = await this.createSchema(database);
            await this.downloadData(database);
            database.close();
            this.databaseConsistent = true;
        } catch (ex) {
            console.error(ex);
            alert('error while importing files:' + JSON.stringify(ex));
        }
        this.importing = false;
        await wakeLock.release();
    }

    async downloadData(database: IDBDatabase) {
        await this.loadData();
        const promises = [];
        const subscriptions = [];

        if (this.musicMetadataImported < this.musicTotal!) {
            this.musicMetadataImported = 0;
            const playlists = await this.PlaylistService.listPlaylists();
            const playlistsObservable = database.import(OfflineMusicPage.PlaylistsStoreName, playlists, (x) => x.id);
            subscriptions.push(playlistsObservable.subscribe(() => this.playlistsImported++));
            promises.push(playlistsObservable.toPromise());
        }

        if (this.instrumentsImported < this.instrumentsTotal!) {
            this.instrumentsImported = 0;
            const instruments = await this.MusicService.getInstruments();
            const instrumentsObservable = database.import(OfflineMusicPage.InstrumentsStoreName, instruments, (x) => x.id);
            subscriptions.push(instrumentsObservable.subscribe(() => this.instrumentsImported++));
            promises.push(instrumentsObservable.toPromise());
        }

        if (this.musicMetadataImported < this.musicTotal! || this.musicImported < this.musicTotal!) {
            const music = await this.MusicService.getAll();

            if (this.musicMetadataImported < this.musicTotal!) {
                this.musicMetadataImported = 0;
                const musicObservable = database.import(OfflineMusicPage.MusicStoreName, music, (x) => x.hash);
                subscriptions.push(musicObservable.subscribe(() => this.musicMetadataImported++));
                promises.push(musicObservable.toPromise());
            }

            if (this.musicImported < this.musicTotal!) promises.push(this.importMusic(music));
        }

        await Promise.all(promises);
        subscriptions.forEach((x) => x.unsubscribe());
    }

    async importMusic(metadata: MusicModel[]) {
        let errors = 0;
        for (const track of metadata) {
            if (await MusicCache.match(OfflineMusicPage.CacheKey(track.hash))) continue;

            var result = await this.FileService.getAudio(track.path, true);
            if (!result) {
                console.error('track could not be imported: ' + track.name);
                errors++;
                continue;
            }

            MusicCache.put(OfflineMusicPage.CacheKey(track.hash), new Response(result.data));
            this.musicImported++;
        }

        if (errors > 0) alert('Errors occurred while importing tracks');
    }

    async createSchema(database: IDBDatabase | null) {
        if (database && !OfflineMusicPage.StoreNames.every((storeName) => database!.objectStoreNames.contains(storeName))) {
            console.error('database exists, but has invalid schema, recreating');
            database.close();
            await IndexedDbService.deleteDatabase(OfflineMusicPage.DbName);
            database = null;
        }

        if (!database)
            database = await IndexedDbService.createDatabase(
                OfflineMusicPage.DbName,
                OfflineMusicPage.DbVersion,
                ...OfflineMusicPage.StoreNames
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
        await this.deleteContainer(OfflineMusicPage.MusicStoreName);
        OfflineSession.musicMetadata = [];
        this.requestFullUpdate();
    }

    async deletePlaylists() {
        await this.deleteContainer(OfflineMusicPage.PlaylistsStoreName);
        OfflineSession.playlists = [];
        OfflineSession.temporaryPlaylists = {};
    }

    async deleteInstruments() {
        await this.deleteContainer(OfflineMusicPage.InstrumentsStoreName);
        OfflineSession.instruments = [];
    }

    async deleteContainer(storeName: string) {
        let database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
        if (!database) throw new Error('database not found');

        await database.clearStore(storeName);

        database.close();
    }

    override render() {
        return renderOfflineMusicImportPage.call(this);
    }
}
