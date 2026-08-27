import { InstrumentModel, MusicModel, PlaylistModel } from '../obscuritas-media-manager-backend-client';
import { IndexedDbService } from '../services/indexed-db.service';
import { AudioService } from './audio.service';
import { OfflineMusicCache } from './offline-music.cache';

export class OfflineSession {
    public static temporaryPlaylists = new Proxy({} as Record<string, string[] | undefined>, {
        get(_, prop: string) {
            const stored = sessionStorage.getItem(`playlists.${prop}`);
            // undefined, not [] - an empty array is truthy and would shadow every `??` fallback
            // to the stored playlists, which is why stored playlists could not be opened at all.
            return stored ? (JSON.parse(stored) as string[]) : undefined;
        },

        set(_, prop: string, value: string[]) {
            sessionStorage.setItem(`playlists.${prop}`, JSON.stringify(value));
            return true;
        },

        deleteProperty(_, prop: string) {
            sessionStorage.removeItem(`playlists.${prop}`);
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

    public static playedTracks = new Map<string, Blob>();

    private static initialization?: Promise<void>;

    public static clearTemporaryPlaylists() {
        for (const key of Object.keys(sessionStorage))
            if (key.startsWith('playlists.')) sessionStorage.removeItem(key);
    }

    /** Idempotent and safe to call concurrently; the AudioService is created exactly once. */
    public static initialize() {
        this.initialization ??= this.runInitialize().finally(() => {
            if (!this.initialized) this.initialization = undefined;
        });
        return this.initialization;
    }

    private static async runInitialize() {
        this.audio ??= new AudioService();
        await OfflineMusicCache.ensureServiceWorker().catch((error) =>
            console.error('service worker could not be ensured', error),
        );

        if (!(await this.readStores())) return;
        if ([this.musicMetadata, this.playlists, this.instruments, this.trackHashes].every((x) => x.length == 0)) return;

        document.body.querySelector('loading-screen')?.remove();
        this.initialized = true;
    }

    /**
     * Re-reads every store. initialize() is memoised so a second call is a no-op - after an import
     * or a deletion the in-memory copies are stale until this runs, which is why the import page
     * used to show nothing until the page was reloaded.
     */
    public static async reload() {
        await this.readStores();
        if (!this.initialized && this.musicMetadata.length) {
            document.body.querySelector('loading-screen')?.remove();
            this.initialized = true;
            this.initialization = Promise.resolve();
        }
    }

    private static async readStores() {
        const database = await this.openDatabase();
        if (!database) return false;

        try {
            this.musicMetadata = await database.readStore<MusicModel>(this.MusicMetadataStoreName).catch(() => []);
            this.playlists = await database.readStore<PlaylistModel>(this.PlaylistsStoreName).catch(() => []);
            this.instruments = await database.readStore<InstrumentModel>(this.InstrumentsStoreName).catch(() => []);
            this.trackHashes = await database.getKeys(this.MusicStoreName).catch(() => []);
        } finally {
            database.close();
        }

        return true;
    }

    static async openDatabase() {
        try {
            return await IndexedDbService.openDatabase(OfflineSession.DbName, OfflineSession.DbVersion);
        } catch (error) {
            console.error('offline database could not be opened', error);
            return null;
        }
    }

    static async getTrackBlob(trackHash: string) {
        const cached = this.playedTracks.get(trackHash);
        if (cached) return cached;

        const database = await this.openDatabase();
        if (!database) return null;

        try {
            const blob = await database.getItemByKey<Blob>(this.MusicStoreName, trackHash);
            if (blob) this.playedTracks.set(trackHash, blob);
            return blob ?? null;
        } finally {
            database.close();
        }
    }

    /**
     * Loads the window of tracks around currentIndex into playedTracks and evicts everything
     * outside it - except the track that is currently playing, whose blob must stay reachable so
     * the element can be re-attached after iOS reclaims its decoder.
     */
    static async prefetchAdjacent(playlist: string[], currentIndex: number, windowSize = 8) {
        const start = Math.max(0, currentIndex - windowSize);
        const end = Math.min(playlist.length - 1, currentIndex + windowSize);
        const keep = new Set(playlist.slice(start, end + 1));
        if (this.audio?.activeTrackHash) keep.add(this.audio.activeTrackHash);

        for (const hash of [...this.playedTracks.keys()]) if (!keep.has(hash)) this.playedTracks.delete(hash);

        const missing = [...keep].filter((hash) => !this.playedTracks.has(hash));
        if (!missing.length) return;

        const database = await this.openDatabase();
        if (!database) return;
        try {
            for (const hash of missing) {
                const blob = await database.getItemByKey<Blob>(this.MusicStoreName, hash);
                if (blob) this.playedTracks.set(hash, blob);
            }
        } finally {
            database.close();
        }
    }

    /**
     * @param play `undefined` toggles the track, `true`/`false` force the resulting state.
     * @param cache keep the blob in the in-memory window after playing it.
     */
    static async playTrack(track: MusicModel, play?: boolean, cache = true) {
        const blob = await this.getTrackBlob(track.hash);
        if (!blob) throw new Error(`track ${track.hash} is not in the offline cache`);
        if (!cache) this.playedTracks.delete(track.hash);

        await this.audio.setTrack(blob, track, play);
    }
}
