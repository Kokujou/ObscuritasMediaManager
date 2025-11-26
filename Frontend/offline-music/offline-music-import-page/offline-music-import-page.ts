import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { FileClient, MusicClient, MusicModel, PlaylistClient } from '../../obscuritas-media-manager-backend-client';
import { AuthenticatedRequestService } from '../../services/authenticated-request.service';
import { IndexedDbService } from '../../services/indexed-db.service';
import { OfflineMusicPage } from '../offline-music-page/offline-music-page';
import { renderOfflineMusicImportPageStyles } from './offline-music-import-page.css';
import { renderOfflineMusicImportPage } from './offline-music-import-page.html';

const BackendUrl = '../Backend';

@customElement('offline-music-import-page')
export class OfflineMusicImportPage extends LitElementBase {
    static override get styles() {
        return renderOfflineMusicImportPageStyles();
    }

    static async checkDataExists(database: IDBDatabase | null) {
        if (!database) return false;

        if (OfflineMusicPage.StoreNames.some((storeName) => !database.objectStoreNames.contains(storeName))) return false;

        const musicMetadataImported = await database.countStore(OfflineMusicPage.MusicStoreName);
        const instrumentsImported = await database.countStore(OfflineMusicPage.InstrumentsStoreName);
        const musicImported = (await (await caches.open(OfflineMusicPage.CacheName)).keys()).length;

        try {
            if (musicMetadataImported <= 0) return false;
            if (instrumentsImported <= 0) return false;
            if (musicImported <= 0) return false;

            return true;
        } catch {
            return true;
        }
    }

    protected declare database?: IDBDatabase | null;
    protected declare musicStorage: Cache;

    @state() protected declare musicTotal?: number;
    @state() protected declare playlistsTotal?: number;
    @state() protected declare instrumentsTotal?: number;

    @state() protected declare musicMetadataImported: number;
    @state() protected declare musicImported: number;
    @state() protected declare playlistsImported: number;
    @state() protected declare instrumentsImported: number;

    @state() protected declare databaseConsistent: boolean;
    @state() protected declare importing: boolean;

    protected requestService = new AuthenticatedRequestService();
    protected MusicService = new MusicClient(BackendUrl, this.requestService);
    protected PlaylistService = new PlaylistClient(BackendUrl, this.requestService);
    protected FileService = new FileClient(BackendUrl, this.requestService);

    get offlineMode() {
        return !this.musicTotal || !this.playlistsTotal || !this.instrumentsTotal;
    }

    get schemaConsistent() {
        return (
            this.database && OfflineMusicPage.StoreNames.every((storeName) => this.database!.objectStoreNames.contains(storeName))
        );
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

        this.database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
        this.musicStorage = await caches.open(OfflineMusicPage.CacheName);
        document.body.querySelector('loading-screen')?.remove();

        await this.loadData();

        this.requestFullUpdate();
    }

    async loadData() {
        try {
            const overview = await this.MusicService.getOverview();
            this.musicTotal = overview.tracks;
            this.playlistsTotal = overview.playlists;
            this.instrumentsTotal = overview.instruments;
        } catch {}

        if (!this.database) return;
        this.musicMetadataImported = await this.database.countStore(OfflineMusicPage.MusicStoreName);
        this.playlistsImported = await this.database.countStore(OfflineMusicPage.PlaylistsStoreName);
        this.instrumentsImported = await this.database.countStore(OfflineMusicPage.InstrumentsStoreName);
        this.musicImported = (await this.musicStorage.keys()).length;

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
            await this.createSchema();
            await this.downloadData();
            this.databaseConsistent = true;
        } catch (ex) {
            console.error(ex);
            alert('error while importing files:' + JSON.stringify(ex));
        }
        this.importing = false;
        await wakeLock.release();
    }

    async downloadData() {
        if (!this.database) throw new Error('database does not exists.');

        await this.loadData();
        const promises = [];
        const subscriptions = [];

        if (this.musicMetadataImported < this.musicTotal!) {
            this.musicMetadataImported = 0;
            const playlists = await this.PlaylistService.listPlaylists();
            const playlistsObservable = this.database.import(OfflineMusicPage.PlaylistsStoreName, playlists, (x) => x.id);
            subscriptions.push(playlistsObservable.subscribe(() => this.playlistsImported++));
            promises.push(playlistsObservable.toPromise());
        }

        if (this.instrumentsImported < this.instrumentsTotal!) {
            this.instrumentsImported = 0;
            const instruments = await this.MusicService.getInstruments();
            const instrumentsObservable = this.database.import(OfflineMusicPage.InstrumentsStoreName, instruments, (x) => x.id);
            subscriptions.push(instrumentsObservable.subscribe(() => this.instrumentsImported++));
            promises.push(instrumentsObservable.toPromise());
        }

        if (this.musicMetadataImported < this.musicTotal! || this.musicImported < this.musicTotal!) {
            const music = await this.MusicService.getAll();

            if (this.musicMetadataImported < this.musicTotal!) {
                this.musicMetadataImported = 0;
                const musicObservable = this.database.import(OfflineMusicPage.MusicStoreName, music, (x) => x.hash);
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
            if (await this.musicStorage.match(OfflineMusicPage.CacheKey(track.hash))) continue;

            var result = await this.FileService.getAudio(track.path, true);
            if (!result) {
                console.error('track could not be imported: ' + track.name);
                errors++;
                continue;
            }

            this.musicStorage.put(OfflineMusicPage.CacheKey(track.hash), new Response(result.data));
            this.musicImported++;
        }

        if (errors > 0) alert('Errors occurred while importing tracks');
    }

    async createSchema() {
        this.database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);

        if (this.database && !this.schemaConsistent) {
            console.error('database exists, but has invalid schema, recreating');
            this.database.close();
            await IndexedDbService.deleteDatabase(OfflineMusicPage.DbName);
            this.database = null;
        }

        if (!this.database)
            this.database = await IndexedDbService.createDatabase(
                OfflineMusicPage.DbName,
                OfflineMusicPage.DbVersion,
                ...OfflineMusicPage.StoreNames
            );
    }

    async deleteMusicCache() {}

    override render() {
        return renderOfflineMusicImportPage.call(this);
    }
}
