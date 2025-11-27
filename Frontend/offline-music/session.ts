import { Observable } from '../data/observable';
import { Session } from '../data/session';
import { InstrumentModel, MusicModel, PlaylistModel } from '../obscuritas-media-manager-backend-client';
import { IndexedDbService } from '../services/indexed-db.service';
import { MusicCache, OfflineMusicPage } from './offline-music-page/offline-music-page';

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

    public static musicMetadata: MusicModel[] = [];
    public static playlists: PlaylistModel[] = [];
    public static trackUrls: string[] = [];
    public static instruments: InstrumentModel[] = [];

    public static audio: HTMLAudioElement;
    public static visualizationData = new Observable<Float32Array<ArrayBuffer>>(new Float32Array());
    public static activeTrackHash?: string;
    public static audioProgress = new Observable(null);

    public static initialized = false;

    protected static playedTracks: Record<string, string> = {};

    public static async initialize() {
        if (this.initialized) return;

        this.audio = document.body.appendChild(document.createElement('audio'));
        this.setupAudio();

        Session.currentPage.subscribe((newPage) => {
            if (newPage) this.audio.src = '';
        });

        const database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
        if (!database) return;

        this.musicMetadata = await database.readStore<MusicModel>(OfflineMusicPage.MusicStoreName);
        this.playlists = await database.readStore<PlaylistModel>(OfflineMusicPage.PlaylistsStoreName);
        this.instruments = await database.readStore<InstrumentModel>(OfflineMusicPage.InstrumentsStoreName);
        this.trackUrls = (await MusicCache.keys()).map((x) => x.url);

        document.body.querySelector('loading-screen')?.remove();
        this.initialized = true;
    }

    static async setupAudio() {
        this.audio.addEventListener('timeupdate', () => this.audioProgress.next(null));

        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume) / 100);

        // @ts-ignore
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.audioWorklet.addModule('processor.js');
        const track = audioContext.createMediaElementSource(this.audio);
        const workletNode = new AudioWorkletNode(audioContext, 'sample-processor');
        track.connect(workletNode).connect(audioContext.destination);

        workletNode.port.onmessage = (event) =>
            OfflineSession.visualizationData.next(event.data.map((sample: number) => sample / this.audio.volume));

        this.audio.addEventListener('play', () => {
            if (audioContext.state === 'suspended') audioContext.resume();
        });
    }

    static async toggleTrack(track: MusicModel, force = false) {
        this.activeTrackHash = track.hash;
        let source = this.playedTracks[track.hash];
        if (!source) {
            const response = await MusicCache.match(OfflineMusicPage.CacheKey(track.hash));
            if (!response) {
                alert('corrupt cache!');
                throw new Error('corrupt cache');
            }

            const blob = await response.blob();
            source = URL.createObjectURL(blob);
            this.playedTracks[track.hash] = source;
        }

        if (this.audio.src != source) {
            this.audio.src = source;
            await new Promise<void>((resolve) => this.audio.addEventListener('loadedmetadata', () => resolve()));
        }

        if (this.audio.paused || force) this.audio.play();
        else this.audio.pause();
    }

    static changeVolume(volume: number) {
        this.audio.volume = volume;
        localStorage.setItem('volume', `${volume * 100}`);
    }
}
