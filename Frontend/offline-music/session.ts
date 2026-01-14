import { Observable, Subscription } from '../data/observable';
import { Session } from '../data/session';
import { InstrumentModel, MusicModel, PlaylistModel } from '../obscuritas-media-manager-backend-client';
import { IndexedDbService } from '../services/indexed-db.service';

const SILENT_MP3 =
    'data:audio/wav;base64,UklGRpgiAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXQiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

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

    public static audio: HTMLAudioElement;
    public static visualizationAudio: HTMLAudioElement;
    public static visualizationData = new Observable<Float32Array<ArrayBuffer>>(new Float32Array());
    public static activeTrackHash?: string;
    public static audioProgress = new Observable(null);

    public static initialized = false;

    protected static playedTracks: Record<string, string> = {};

    public static readonly DbName = 'ObscuritasMediaManager.Music';
    public static readonly DbVersion = 1;

    private static pageSubscription?: Subscription;

    public static async initialize() {
        if (this.initialized) return;

        if (!this.audio) {
            this.audio = document.body.appendChild(document.createElement('audio'));
            this.visualizationAudio = document.body.appendChild(document.createElement('audio'));
            this.audio.src = SILENT_MP3;
            this.setupAudio();
        }

        this.pageSubscription ??= Session.currentPage.subscribe((newPage, oldPage) => {
            if (newPage && newPage != oldPage) {
                this.activeTrackHash = undefined;
                this.audio.src = SILENT_MP3;
            }
        });

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

    static async setupAudio() {
        this.audio.addEventListener('timeupdate', () => this.audioProgress.next(null));

        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume) / 100);

        // @ts-ignore
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.audioWorklet.addModule('./processor.js');
        const track = audioContext.createMediaElementSource(this.visualizationAudio);
        const workletNode = new AudioWorkletNode(audioContext, 'sample-processor');
        track.connect(workletNode);

        workletNode.port.onmessage = (event) => OfflineSession.visualizationData.next(event.data);

        this.audio.addEventListener('play', () => {
            if (audioContext.state === 'suspended') audioContext.resume();
            this.syncVisualization();
        });
        this.audio.addEventListener('pause', () => this.syncVisualization());
        this.audio.addEventListener('seeked', () => this.syncVisualization());
        this.audio.addEventListener('loadstart', () => this.syncVisualization());

        navigator.mediaSession.setActionHandler('play', () => this.audio.play());
        navigator.mediaSession.setActionHandler('pause', () => this.audio.pause());

        document.addEventListener('visibilitychange', () => this.syncVisualization());
    }

    static syncVisualization() {
        if (this.visualizationAudio.src != this.audio.src) this.visualizationAudio.src = this.audio.src;
        if (this.audio.paused) this.visualizationAudio.pause();
        else this.visualizationAudio.play();
        this.visualizationAudio.currentTime = this.audio.currentTime;
    }

    static async openDatabase() {
        return await IndexedDbService.openDatabase(OfflineSession.DbName, OfflineSession.DbVersion);
    }

    static async cacheTrack(trackHash: string, blob: Blob) {
        let source = this.playedTracks[trackHash];
        if (source) return;

        if (!blob) {
            alert('corrupt cache!');
            throw new Error('corrupt cache');
        }

        source = URL.createObjectURL(blob);
        this.playedTracks[trackHash] = source;
    }

    static toggleTrackSync(track: MusicModel, event?: Event, force = false) {
        let source = this.playedTracks[track.hash];
        if (!source) return;

        if (this.activeTrackHash != track.hash) {
            this.audio.onloadedmetadata = () => {
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: track.name,
                        artist: track.author ?? 'Unbekannter Autor',
                    });
                }
            };

            this.audio.src = source;
            this.activeTrackHash = track.hash;
        }

        if (this.audio.paused || force) {
            if (event) this.audio.play();
        } else this.audio.pause();
    }

    static async toggleTrack(track: MusicModel, event?: Event, force = false) {
        let source = this.playedTracks[track.hash];

        if (!source) {
            const database = await this.openDatabase();
            const blob = await database!.getItemByKey<Blob>(this.MusicStoreName, track.hash);
            database!.close();

            if (!blob) {
                alert('corrupt cache!');
                throw new Error('corrupt cache');
            }

            const arrayBuffer = await blob.arrayBuffer();
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            try {
                await audioCtx.decodeAudioData(arrayBuffer);
                console.log('MP3 dekodierbar');
            } catch (e) {
                alert(JSON.stringify(e.code));
            }
            source = URL.createObjectURL(blob);
            this.playedTracks[track.hash] = source;
        }

        if (this.activeTrackHash != track.hash) {
            await new Promise<void>((resolve, reject) => {
                this.audio.onloadedmetadata = () => {
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: track.name,
                            artist: track.author ?? 'Unbekannter Autor',
                        });
                    }
                    resolve();
                };
                this.audio.onerror = async () => reject(this.audio.error?.code);

                this.audio.src = source;
                this.activeTrackHash = track.hash;
                this.audio.load();
            });
        }

        if (this.audio.paused || force) {
            if (event) await this.audio.play();
        } else this.audio.pause();
    }

    static changeVolume(volume: number) {
        this.audio.volume = volume;
        localStorage.setItem('volume', `${volume * 100}`);
    }
}
