import { Observable, Subscription } from '../data/observable';
import { Session } from '../data/session';
import { MusicModel } from '../obscuritas-media-manager-backend-client';

const SILENT_MP3 =
    'data:audio/wav;base64,UklGRpgiAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXQiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export class AudioService {
    public audio: HTMLAudioElement;
    public visualizationAudio: HTMLAudioElement;
    public visualizationData = new Observable<Float32Array<ArrayBuffer>>(new Float32Array());
    public onNextTrack = new Observable<void>(null!);
    public audioProgress = new Observable(null);
    public activeTrackHash?: string;

    private pageSubscription?: Subscription;

    private _paused = true;
    public get paused() {
        return this._paused;
    }

    public get volume(): number {
        var fromStorage = localStorage.getItem('volume');
        if (fromStorage) return Number.parseInt(fromStorage) / 100;
        else this.changeVolume(1);
        return this.volume;
    }

    public get currentTime() {
        if (this._paused) return this._lastPosition;
        return this.audio.currentTime;
    }

    public set currentTime(value: number) {
        this._lastPosition = value;
        this.audio.currentTime = value;
        this.visualizationAudio.currentTime = value;
    }

    public get duration() {
        return this.audio.duration;
    }

    private _lastPosition = 0;

    constructor() {
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
    }

    async setupAudio() {
        this.audio.addEventListener('timeupdate', () => this.audioProgress.next(null));
        this.audio.preload = 'auto';

        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume) / 100);

        // @ts-ignore
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.audioWorklet.addModule('./processor.js');
        const track = audioContext.createMediaElementSource(this.visualizationAudio);
        const workletNode = new AudioWorkletNode(audioContext, 'sample-processor');
        track.connect(workletNode);

        workletNode.port.onmessage = (event) => this.visualizationData.next(event.data);

        this.audio.addEventListener('play', () => {
            if (audioContext.state === 'suspended') audioContext.resume();
            this.syncVisualization();
        });
        this.audio.addEventListener('pause', () => this.syncVisualization());
        this.audio.addEventListener('seeked', () => this.syncVisualization());
        this.audio.addEventListener('loadstart', () => this.syncVisualization());

        navigator.mediaSession.setActionHandler('play', () => this.play());
        navigator.mediaSession.setActionHandler('pause', () => this.pause());

        document.addEventListener('visibilitychange', () => this.syncVisualization());
        this.audio.addEventListener('ended', () => this.onNextTrack.next());
    }

    syncVisualization() {
        if (this.visualizationAudio.src != this.audio.src) this.visualizationAudio.src = this.audio.src;
        if (this._paused && !this.visualizationAudio.paused) this.visualizationAudio.pause();
        if (!this._paused && this.visualizationAudio.paused) this.visualizationAudio.play();
        this.visualizationAudio.currentTime = this.audio.currentTime;
    }

    changeVolume(volume: number) {
        this.audio.volume = volume;
        localStorage.setItem('volume', `${volume * 100}`);
    }

    pause() {
        this._paused = true;
        this._lastPosition = this.audio.currentTime;
        this.audio.muted = true;
        this.audio.loop = true;
        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
        this.syncVisualization();
    }

    play() {
        this._paused = false;
        this.audio.loop = false;
        this.currentTime = this._lastPosition;
        this.audio.volume = this.volume;
        this.audio.muted = false;
        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'playing';
        this.syncVisualization();
        return this.audio.play();
    }

    toggleTrackSync(buffer: ArrayBuffer, track: MusicModel, event?: Event, force = false) {
        if (!buffer) return Promise.resolve();

        var result: Promise<void> | void = null!;
        if (this.activeTrackHash != track.hash) {
            result = new Promise<void>((resolve, reject) => {
                this.audio.addEventListener('loadedmetadata', () => {
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: track.name,
                            artist: track.author ?? 'Unbekannter Autor',
                            album: track.source ?? undefined,
                        });
                    }
                    this.audioProgress.next(null);
                    resolve();
                });
                this.audio.addEventListener('error', async () => reject(this.audio.error?.code));
            });
        }

        if (this.paused || force) {
            const position = this.activeTrackHash == track.hash ? this.currentTime : 0;
            const oldSrc = this.audio.src;
            this.audio.src = URL.createObjectURL(new Blob([buffer], { type: 'audio/mpeg' }));
            URL.revokeObjectURL(oldSrc);
            this.activeTrackHash = track.hash;

            if (event) {
                result = result ? result.then(() => this.play()) : this.play();
                result = result.then(() => {
                    this.currentTime = position;
                });
            }
        } else result = result ? result.then(() => this.pause()) : this.pause();

        return result;
    }
}
