import { Observable, Subscription } from '../data/observable';
import { Session } from '../data/session';
import { MusicModel } from '../obscuritas-media-manager-backend-client';
import { createSilentWav } from './create-dummy-audio';

export class AudioService {
    declare public audio: HTMLAudioElement;
    declare public visualizationAudio: HTMLAudioElement;
    public visualizationData = new Observable<Float32Array<ArrayBuffer>>(new Float32Array());
    public onNextTrack = new Observable<void>(null!);
    public audioProgress = new Observable(null);
    public activeTrackHash?: string;

    private pageSubscription?: Subscription;
    private readonly silentSrc = createSilentWav();

    public get paused() {
        return this.audio.paused;
    }

    public get volume(): number {
        var fromStorage = localStorage.getItem('volume');
        if (fromStorage) return Number.parseInt(fromStorage) / 100;
        else this.changeVolume(1);
        return this.volume;
    }

    public get currentTime() {
        return this.audio.currentTime;
    }

    public set currentTime(value: number) {
        this.audio.currentTime = value;
        this.visualizationAudio.currentTime = value;
    }

    public get duration() {
        return this.audio.duration;
    }

    constructor() {
        if (!this.audio) {
            this.visualizationAudio = document.body.appendChild(document.createElement('audio'));
            this.audio = document.body.appendChild(document.createElement('audio'));

            this.audio.src = this.silentSrc;
            this.visualizationAudio.src = this.silentSrc;

            this.setupAudio();
        }

        this.pageSubscription ??= Session.currentPage.subscribe((newPage, oldPage) => {
            if (newPage && newPage != oldPage) {
                this.activeTrackHash = undefined;
                this.audio.src = this.silentSrc;
                this.visualizationAudio.src = this.silentSrc;
            }
        });
    }

    async setupAudio() {
        this.audio.addEventListener('timeupdate', () => this.audioProgress.next(null));
        this.audio.preload = 'auto';

        this.changeVolume(this.volume);

        // @ts-ignore
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.audioWorklet.addModule('./processor.js');
        const track = audioContext.createMediaElementSource(this.visualizationAudio);
        const workletNode = new AudioWorkletNode(audioContext, 'sample-processor');
        track.connect(workletNode);

        workletNode.port.onmessage = (event) => {
            this.visualizationData.next(event.data);
            this.audioProgress.next(null);
        };

        // visibilitychange is not a trusted user-gesture context, so awaiting here
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState == 'visible') {
                await audioContext.resume();
                if (!this.audio.paused) {
                    this.visualizationAudio.currentTime = this.audio.currentTime;
                    this.visualizationAudio.play().catch(() => {});
                }
            } else {
                this.visualizationAudio.pause();
                audioContext.suspend();
            }
        });

        this.audio.addEventListener('play', () => audioContext.resume());
        this.audio.addEventListener('seeked', () => this.syncVisualization());
        this.audio.addEventListener('loadstart', () => this.syncVisualization());

        navigator.mediaSession.setActionHandler('play', () => this.play());
        navigator.mediaSession.setActionHandler('pause', () => this.pause());

        this.audio.addEventListener('ended', () => this.onNextTrack.next());
    }

    syncVisualization() {
        this.visualizationAudio.currentTime = this.audio.currentTime;
    }

    changeVolume(volume: number) {
        this.audio.volume = volume;
        localStorage.setItem('volume', `${volume * 100}`);
    }

    pause() {
        this.visualizationAudio.pause();
        this.audio.pause();
        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
    }

    play() {
        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'playing';
        if (document.visibilityState === 'visible') this.visualizationAudio.play().catch(() => {});
        return this.audio.play();
    }

    stop() {
        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'none';
        this.audio.pause();
        this.audio.removeAttribute('src');
        this.visualizationAudio.pause();
        this.visualizationAudio.removeAttribute('src');
        this.activeTrackHash = undefined;
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
            const newSrc = URL.createObjectURL(new Blob([buffer], { type: 'audio/mpeg' }));
            this.audio.src = newSrc;
            this.visualizationAudio.src = newSrc;
            // Only revoke blob URLs we created for tracks — never the silent sentinel.
            if (oldSrc !== this.silentSrc) URL.revokeObjectURL(oldSrc);
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
