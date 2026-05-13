import { InstrumentModel, MusicModel, PlaylistModel } from '../obscuritas-media-manager-backend-client';
import { IndexedDbService } from '../services/indexed-db.service';
import { AudioService } from './audio.service';

export class OfflineSession {
    public static temporaryPlaylists = new Proxy({} as Record<string, string[]>, {
        get(_, prop: string) {
            return JSON.parse(sessionStorage.getItem(`playlists.${prop}`) ?? '[]');
        },

        set(_, prop: string, value: string[]) {
            sessionStorage.setItem(`playlists.${prop}`, JSON.stringify(value));
            return true;
        },
    });

    public static readonly MusicStoreName = 'music';
    public static readonly MusicMetadataStoreName = 'music-metadata';
    public static readonly PlaylistsStoreName = 'playlists';
    public static readonly InstrumentsStoreName = 'instruments';
    public static readonly StoreNames = [
        this.MusicStoreName,
        this.MusicMetadataStoreName,
        this.PlaylistsStoreName,
        this.InstrumentsStoreName,
    ];

    public static musicMetadata: MusicModel[] = [];
    public static playlists: PlaylistModel[] = [];
    public static trackHashes: string[] = [];
    public static instruments: InstrumentModel[] = [];

    public static initialized = false;

    public static readonly DbName = 'ObscuritasMediaManager.Music';
    public static readonly DbVersion = 1;

    declare public static audio: AudioService;

    public static playedTracks: Record<string, ArrayBuffer> = {};

    public static async initialize() {
        if (this.initialized) return;

        this.audio = new AudioService();

        const database = await this.openDatabase();
        if (!database) return;

        this.musicMetadata = await database.readStore<MusicModel>(this.MusicMetadataStoreName).catch(() => []);
        this.playlists = await database.readStore<PlaylistModel>(this.PlaylistsStoreName).catch(() => []);
        this.instruments = await database.readStore<InstrumentModel>(this.InstrumentsStoreName).catch(() => []);
        this.trackHashes = await database.getKeys(this.MusicStoreName);
        database.close();

        if ([this.musicMetadata, this.playlists, this.instruments, this.trackHashes].every((x) => x.length == 0)) return;

        document.body.querySelector('loading-screen')?.remove();
        this.initialized = true;
    }

    static async openDatabase() {
        return await IndexedDbService.openDatabase(OfflineSession.DbName, OfflineSession.DbVersion);
    }

    static async cacheTrack(trackHash: string, blob: Blob | null) {
        let source = this.playedTracks[trackHash];
        if (source) return;

        if (!blob) {
            alert('corrupt cache!');
            throw new Error('corrupt cache');
        }

        source = await blob.arrayBuffer();
        this.playedTracks[trackHash] = source;
    }

    static async toggleTrack(track: MusicModel, event?: Event, force = false, cache = true) {
        let buffer = this.playedTracks[track.hash];

        if (!buffer) {
            const database = await this.openDatabase();
            const blob = await database!.getItemByKey<Blob>(this.MusicStoreName, track.hash);
            database!.close();
            if (blob) buffer = await blob.arrayBuffer();

            if (cache) await this.cacheTrack(track.hash, blob);
        }

        await OfflineSession.audio.toggleTrackSync(buffer!, track, event, force);
    }
}
