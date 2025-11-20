import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { MusicClient, PlaylistClient } from '../../obscuritas-media-manager-backend-client';
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

    protected declare database?: IDBDatabase | null;

    @state() protected declare musicTotal?: number;
    @state() protected declare playlistsTotal?: number;
    @state() protected declare instrumentsTotal?: number;

    @state() protected declare musicImported: number;
    @state() protected declare playlistsImported: number;
    @state() protected declare instrumentsImported: number;

    protected requestService = new AuthenticatedRequestService();
    protected MusicService = new MusicClient(BackendUrl, this.requestService);
    protected PlaylistService = new PlaylistClient(BackendUrl, this.requestService);

    get databaseConsistent() {
        if (!this.database) return false;
        return OfflineMusicPage.StoreNames.every((storeName) => this.database!.objectStoreNames.contains(storeName));
    }

    constructor() {
        super();
        this.musicImported = 0;
        this.playlistsImported = 0;
        this.instrumentsImported = 0;
    }

    async connectedCallback() {
        super.connectedCallback();

        this.database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
        document.body.querySelector('loading-screen')?.remove();
    }

    async importData() {
        await this.createSchema();
        await this.downloadData();
    }

    async downloadData() {
        if (!this.database) throw new Error('database does not exists.');

        const music = await this.MusicService.getAll();
        this.musicTotal = music.length;
        const musicObservable = this.database.import(OfflineMusicPage.MusicStoreName, music, (x) => x.hash);
        const musicSubscription = musicObservable.subscribe(() => this.musicImported++);

        const playlists = await this.PlaylistService.listPlaylists();
        this.playlistsTotal = playlists.length;
        const playlistsObservable = this.database.import(OfflineMusicPage.PlaylistsStoreName, playlists, (x) => x.id);
        const playlistsSubscription = playlistsObservable.subscribe(() => this.playlistsImported++);

        const instruments = await this.MusicService.getInstruments();
        this.instrumentsTotal = instruments.length;
        const instrumentsObservable = this.database.import(OfflineMusicPage.InstrumentsStoreName, instruments, (x) => x.id);
        const instrumentsSubscription = instrumentsObservable.subscribe(() => this.instrumentsImported++);

        await Promise.all([musicObservable.toPromise(), playlistsObservable.toPromise(), instrumentsObservable.toPromise()]);

        musicSubscription.unsubscribe();
        playlistsSubscription.unsubscribe();
        instrumentsSubscription.unsubscribe();
    }

    async createSchema() {
        this.database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);

        if (this.database && !this.databaseConsistent) {
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

    override render() {
        return renderOfflineMusicImportPage.call(this);
    }
}
