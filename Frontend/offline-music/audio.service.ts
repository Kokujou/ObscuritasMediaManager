import { Observable } from '../data/observable';
import { MusicModel } from '../obscuritas-media-manager-backend-client';
import { createSilentWav } from './create-dummy-audio';
import { SessionRecorder } from './session-recorder';

/** WebKit adds a fourth, non-standard state that plain `suspended` checks miss. */
type WebKitAudioContextState = AudioContextState | 'interrupted';

export class AudioService {
    declare public audio: HTMLAudioElement;
    declare public visualizationAudio: HTMLAudioElement;
    public visualizationData = new Observable<Float32Array<ArrayBuffer>>(new Float32Array());
    public onNextTrack = new Observable<void>(null!);
    public audioProgress = new Observable(null);
    public activeTrackHash?: string;

    private readonly silentSrc = createSilentWav();
    private audioContext?: AudioContext;
    private visualizationRouted = false;
    private activeTrack?: MusicModel;
    private activeBlob?: Blob;
    private activeBlobUrl?: string;
    private pendingLoad?: AbortController;
    private recovering = false;
    private silentFrames = 0;
    private flatLineReported = false;
    /** Bounded so a genuinely undecodable source cannot loop through reload attempts. */
    private recoveryAttempts = 0;
    /**
     * What the user asked for, which is not the same as `audio.paused`: load() and a teardown by
     * the platform both clear `paused` behind our back, so recovery cannot use it to decide
     * whether to resume.
     */
    private intendedPlaying = false;
    private silentHoldSrc?: string;
    /** Set while the element plays inaudible filler instead of being paused. */
    private holding = false;
    private heldTrackSrc?: string;
    private heldPosition = 0;
    private heldDuration = Number.NaN;

    /**
     * Whether the app considers itself paused. While the session-keepalive holds the process by
     * playing inaudible filler, the element is not paused but the app is.
     */
    public get paused() {
        return this.holding || this.audio.paused;
    }

    /**
     * Opt-in: on "pause", keep the element playing silence instead of pausing it.
     *
     * WebKit releases the MediaPlayback process assertion the instant
     * MediaProducerMediaState::IsPlayingAudio drops (WebProcessProxy::updateAudibleMediaAssertions),
     * and that bit requires HTMLMediaElement::computeCanProduceAudio(), which rejects both
     * `muted` and `volume === 0`. It does not inspect the samples - so a real but silent stream at
     * full volume is the only configuration that is inaudible and still counted.
     *
     * Costs: the process stays awake (battery), the audio session keeps other apps interrupted
     * instead of mixing, and iOS reports the element as playing - so the lock-screen glyph is
     * wrong and its commands arrive inverted. Both are handled below.
     */
    public get keepSessionAlive() {
        return localStorage.getItem('offline-music.keep-session-alive') === 'true';
    }

    public set keepSessionAlive(value: boolean) {
        localStorage.setItem('offline-music.keep-session-alive', String(value));
        if (!value && this.holding) this.releaseSilentHold(false);
    }

    /**
     * True when the element claims to play but has no decodable resource behind it. `paused`
     * alone flips to false either way, which is what made the play icon lie after iOS reclaimed
     * the decoder - so the UI reads `playing`, not `!paused`.
     */
    public get stalled() {
        if (this.holding) return false;
        return !this.audio.paused && this.audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA;
    }

    public get playing() {
        return !this.paused && !this.stalled;
    }

    public get volume(): number {
        const fromStorage = localStorage.getItem('volume');
        const parsed = fromStorage == null ? Number.NaN : Number.parseFloat(fromStorage) / 100;
        if (Number.isFinite(parsed)) return Math.min(1, Math.max(0, parsed));
        return 1;
    }

    public get currentTime() {
        return this.holding ? this.heldPosition : this.audio.currentTime;
    }

    public set currentTime(value: number) {
        if (this.holding) {
            this.heldPosition = value;
            return;
        }

        this.audio.currentTime = value;
        if (this.visualizationRouted) this.visualizationAudio.currentTime = value;
    }

    public get duration() {
        return this.holding ? this.heldDuration : this.audio.duration;
    }

    constructor() {
        this.visualizationAudio = document.body.appendChild(document.createElement('audio'));
        this.audio = document.body.appendChild(document.createElement('audio'));
        this.audio.src = this.silentSrc;
        this.visualizationAudio.src = this.silentSrc;
        // Muted until the worklet route exists: a muted element feeds silence into
        // createMediaElementSource, which is the flat visualization line. Without the route the
        // element is never started at all, so muting is not what keeps it inaudible.
        this.visualizationAudio.muted = true;

        this.setupAudio();
        this.setupVisualization().catch((error) => console.error('visualization unavailable', error));
    }

    /**
     * Everything the lock screen and the playlist depend on. Deliberately synchronous and free of
     * awaits: the visualization graph is optional and must not be able to take the media session,
     * the auto-advance handler or the recovery handlers down with it.
     */
    setupAudio() {
        this.audio.preload = 'auto';
        this.changeVolume(this.volume);

        if (SessionRecorder.enabled) SessionRecorder.start();
        this.recordDiagnostics();

        this.audio.addEventListener('timeupdate', () => {
            if (this.holding) return;
            this.audioProgress.next(null);
            this.publishPositionState();
            // Two elements decoding the same source drift apart, and nothing used to pull them
            // back together during playback - the visualization ran off the end of the track and
            // fed the worklet silence, which is the flat line.
            this.correctVisualizationDrift();
        });
        this.audio.addEventListener('durationchange', () => this.publishPositionState());
        this.audio.addEventListener('ratechange', () => this.publishPositionState());
        this.audio.addEventListener('seeked', () => this.syncVisualization());
        this.audio.addEventListener('loadstart', () => this.syncVisualization());
        this.audio.addEventListener('playing', () => this.playVisualization());
        this.audio.addEventListener('pause', () => this.visualizationAudio.pause());
        this.audio.addEventListener('ended', () => {
            if (this.holding) return;
            this.onNextTrack.next();
        });
        this.audio.addEventListener('loadeddata', () => (this.recoveryAttempts = 0));
        this.audio.addEventListener('playing', () => (this.recoveryAttempts = 0));

        this.audio.addEventListener('play', () => {
            void this.resumeAudioContext();
            if (navigator.mediaSession) navigator.mediaSession.playbackState = 'playing';
        });
        this.audio.addEventListener('pause', () => {
            if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
        });

        // iOS reclaims the decoder of a paused, backgrounded element. The element then reports
        // itself as playable while readyState has dropped to 0, so re-attach the source instead
        // of letting play() flip the icon and produce silence.
        for (const event of ['error', 'emptied', 'stalled', 'suspend'])
            this.audio.addEventListener(event, () => this.recoverSource());

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState == 'visible') {
                void this.resumeAudioContext();
                this.recoverSource();
                this.syncVisualization();
                if (!this.audio.paused) this.playVisualization();
            } else {
                this.visualizationAudio.pause();
            }
        });

        // Pins AVAudioSessionCategoryPlayback via AudioSession::categoryOverride, which
        // MediaSessionManagerCocoa::updateSessionState honours before any playing/paused check.
        // Does not keep the process alive on its own - it decides the category a later play()
        // resumes into, and keeps the Web Audio path off AmbientSound.
        this.declarePlaybackAudioSession();

        if ('mediaSession' in navigator) {
            // While holding, iOS believes the element is playing and therefore sends `pause`
            // where the user means play. Never trust the command name over our own state.
            navigator.mediaSession.setActionHandler('play', () => void this.togglePlayback());
            navigator.mediaSession.setActionHandler('pause', () => void this.togglePlayback());
        }
    }

    /** Everything needed to tell a suspended process from a torn-down element, after the fact. */
    private recordDiagnostics() {
        const snapshot = () =>
            `rs=${this.audio.readyState} ns=${this.audio.networkState} err=${this.audio.error?.code ?? '-'} ` +
            `paused=${this.audio.paused ? 1 : 0} loop=${this.audio.loop ? 1 : 0} vol=${this.audio.volume} ` +
            `muted=${this.audio.muted ? 1 : 0} t=${this.audio.currentTime.toFixed(2)} hold=${this.holding ? 1 : 0} ` +
            `ctx=${this.audioContext?.state ?? '-'}`;

        // so a gap line carries the position too: that is what tells a throttled timer apart
        // from a suspended process
        SessionRecorder.stateProvider = snapshot;

        for (const type of ['play', 'playing', 'pause', 'waiting', 'stalled', 'suspend', 'emptied', 'error', 'ended'])
            this.audio.addEventListener(type, () => SessionRecorder.record('evt', `${type}  ${snapshot()}`));

        document.addEventListener('visibilitychange', () =>
            SessionRecorder.record('evt', `visibilitychange → ${document.visibilityState}  ${snapshot()}`),
        );
        for (const type of ['pageshow', 'pagehide', 'freeze', 'resume'])
            window.addEventListener(type, () => SessionRecorder.record('evt', `${type}  ${snapshot()}`));
    }

    private declarePlaybackAudioSession() {
        const audioSession = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
        if (!audioSession) return;

        try {
            audioSession.type = 'playback';
        } catch (error) {
            console.warn('audio session type could not be set', error);
        }
    }

    /** Resolves the ambiguity of an inverted remote command against our own state. */
    async togglePlayback() {
        SessionRecorder.record('act', `remote toggle - logisch ${this.paused ? 'pausiert → play' : 'spielt → pause'}`);
        if (this.paused) await this.play();
        else this.pause();
    }

    async setupVisualization() {
        const AudioContextCtor: typeof AudioContext | undefined =
            window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextCtor || !('AudioWorkletNode' in window)) return;

        const audioContext = new AudioContextCtor();
        this.audioContext = audioContext;

        await audioContext.audioWorklet.addModule('./processor.js');
        const track = audioContext.createMediaElementSource(this.visualizationAudio);
        const workletNode = new AudioWorkletNode(audioContext, 'sample-processor');
        track.connect(workletNode);
        this.visualizationRouted = true;
        // Routed into the graph and not connected to destination => inaudible, so it can and must
        // run unmuted, otherwise the worklet only ever sees zeros.
        this.visualizationAudio.muted = false;

        // Keeps WebKit from parking the context in its non-standard 'interrupted' state. The
        // offset has to be non-zero to count as output; 1e-37 is inaudible.
        const sessionKeepAlive = audioContext.createConstantSource();
        sessionKeepAlive.offset.value = 1e-37;
        sessionKeepAlive.connect(audioContext.destination);
        sessionKeepAlive.start();

        workletNode.port.onmessage = (event) => {
            this.inspectVisualizationFrame(event.data as Float32Array);
            this.visualizationData.next(event.data);
            this.audioProgress.next(null);
        };

        if (!this.audio.paused) this.playVisualization();
    }

    /**
     * The visualization going flat has several possible causes - a stopped element, a drifted one,
     * a suspended context - and they are indistinguishable from the outside. Record the full state
     * the first time it happens so the cause is readable afterwards instead of guessed.
     */
    private inspectVisualizationFrame(frame: Float32Array) {
        if (!frame?.length) return;

        const silent = !frame.some((sample) => sample != 0);
        if (!silent) {
            this.silentFrames = 0;
            this.flatLineReported = false;
            return;
        }

        // ~21 ms per frame at 48 kHz, so 200 frames is roughly four seconds of flat line
        if (++this.silentFrames < 200 || this.flatLineReported) return;
        if (this.audio.paused || this.holding) return;

        this.flatLineReported = true;
        SessionRecorder.record(
            'act',
            'NULLLINIE nach ' +
                this.silentFrames +
                ' stillen Frames — ' +
                `main t=${this.audio.currentTime.toFixed(2)} paused=${this.audio.paused ? 1 : 0} ` +
                `viz t=${this.visualizationAudio.currentTime.toFixed(2)} paused=${this.visualizationAudio.paused ? 1 : 0} ` +
                `ended=${this.visualizationAudio.ended ? 1 : 0} rs=${this.visualizationAudio.readyState} ` +
                `muted=${this.visualizationAudio.muted ? 1 : 0} vol=${this.visualizationAudio.volume} ` +
                `drift=${Math.abs(this.visualizationAudio.currentTime - this.audio.currentTime).toFixed(2)} ` +
                `ctx=${this.audioContext?.state ?? '-'} sr=${this.audioContext?.sampleRate ?? '-'}`,
        );
    }

    private async resumeAudioContext() {
        const state = this.audioContext?.state as WebKitAudioContextState | undefined;
        if (state != 'suspended' && state != 'interrupted') return;

        try {
            await this.audioContext!.resume();
        } catch (error) {
            console.warn('AudioContext could not be resumed', error);
        }
    }

    /**
     * Re-attaches the current track when the element lost its resource behind our back - the shape
     * iOS leaves after reclaiming the decoder of a backgrounded element.
     *
     * The existing object URL is reused rather than re-created: a fresh one would have to revoke
     * the old one, which is the URL the element may already be loading. Only if that reload really
     * fails does it fall back to a new URL, once.
     */
    private recoverSource() {
        if (this.recovering || this.pendingLoad || this.holding) return;
        if (!this.activeBlob || !this.activeBlobUrl) return;
        if (this.audio.readyState != HTMLMediaElement.HAVE_NOTHING) return;
        // NETWORK_LOADING is the only state that means "still fetching"; both EMPTY and
        // NO_SOURCE mean the resource is gone, and currentSrc can linger after either.
        if (this.audio.networkState == HTMLMediaElement.NETWORK_LOADING && this.audio.error == null) return;
        if (this.recoveryAttempts >= 2) return;

        const position = this.audio.currentTime;
        const withFreshUrl = this.recoveryAttempts > 0 || this.audio.error != null;
        this.recoveryAttempts++;

        // Claim the pending-load slot so the `emptied` our own re-attach fires does not count as
        // another attempt; a real failure clears it and the `error` listener retries once, with a
        // fresh object URL that time.
        const loaded = this.waitForMetadata();

        this.recovering = true;
        try {
            if (withFreshUrl) this.assignSource(this.activeBlob);
            else {
                this.audio.src = this.activeBlobUrl;
                if (this.visualizationRouted) this.visualizationAudio.src = this.activeBlobUrl;
            }
            this.audio.load();
        } finally {
            this.recovering = false;
        }

        loaded.then(
            () => {
                this.recoveryAttempts = 0;
                if (!this.intendedPlaying) return;

                if (position > 0) this.audio.currentTime = position;
                this.audio.play().catch((error) => console.warn('playback could not be recovered', error));
            },
            (code) => console.warn('source could not be re-attached, media error', code),
        );
    }

    private publishPositionState() {
        if (!navigator.mediaSession?.setPositionState) return;

        // report the held track, never the filler loop
        const duration = this.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;

        navigator.mediaSession.setPositionState({
            duration,
            playbackRate: this.audio.playbackRate || 1,
            position: Math.min(this.currentTime, duration),
        });
    }

    private assignSource(blob: Blob) {
        const previous = this.activeBlobUrl;
        const url = URL.createObjectURL(blob);

        this.activeBlob = blob;
        this.activeBlobUrl = url;
        this.audio.src = url;
        if (this.visualizationRouted) this.visualizationAudio.src = url;

        if (previous && previous != url) URL.revokeObjectURL(previous);
    }

    private releaseSource() {
        this.recoveryAttempts = 0;
        if (this.activeBlobUrl) URL.revokeObjectURL(this.activeBlobUrl);
        this.activeBlobUrl = undefined;
        this.activeBlob = undefined;
        this.activeTrack = undefined;
        this.activeTrackHash = undefined;
    }

    private playVisualization() {
        if (!this.visualizationRouted || this.holding) return;
        if (this.audio.paused) return;
        this.visualizationAudio.play().catch(() => {});
    }

    /** Resolves once the newly assigned source is ready, rejects with the MediaError code. */
    private waitForMetadata() {
        this.pendingLoad?.abort();
        const controller = new AbortController();
        this.pendingLoad = controller;

        return new Promise<void>((resolve, reject) => {
            const settle = (fn: () => void) => {
                if (this.pendingLoad == controller) this.pendingLoad = undefined;
                controller.abort();
                fn();
            };

            this.audio.addEventListener('loadedmetadata', () => settle(resolve), { signal: controller.signal, once: true });
            this.audio.addEventListener('error', () => settle(() => reject(this.audio.error?.code ?? 'unknown media error')), {
                signal: controller.signal,
                once: true,
            });
        });
    }

    syncVisualization() {
        if (!this.visualizationRouted || this.holding) return;
        if (!Number.isFinite(this.audio.currentTime)) return;
        if (this.visualizationAudio.readyState < HTMLMediaElement.HAVE_METADATA) return;

        this.visualizationAudio.currentTime = this.audio.currentTime;
    }

    private static readonly MaxVisualizationDrift = 0.35;

    private correctVisualizationDrift() {
        if (!this.visualizationRouted || this.holding) return;

        // A suspended or interrupted context stops the worklet while the element keeps playing -
        // a flat line with nothing wrong at the element, so drift alone would never catch it.
        const state = this.audioContext?.state as WebKitAudioContextState | undefined;
        if (state == 'suspended' || state == 'interrupted') void this.resumeAudioContext();

        if (this.visualizationAudio.seeking) return;
        if (this.visualizationAudio.readyState < HTMLMediaElement.HAVE_METADATA) return;

        // ran to its end, or drifted: either way pull it back onto the main element
        if (this.visualizationAudio.ended || this.visualizationAudio.paused) {
            this.syncVisualization();
            this.playVisualization();
            return;
        }

        const drift = Math.abs(this.visualizationAudio.currentTime - this.audio.currentTime);
        if (drift > AudioService.MaxVisualizationDrift) this.syncVisualization();
    }

    changeVolume(volume: number) {
        const clamped = Math.min(1, Math.max(0, volume));
        this.audio.volume = clamped;
        localStorage.setItem('volume', `${clamped * 100}`);
    }

    pause() {
        this.intendedPlaying = false;
        this.visualizationAudio.pause();

        if (this.keepSessionAlive && this.activeBlobUrl && !this.audio.paused) this.enterSilentHold();
        else this.audio.pause();

        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
    }

    /**
     * Swaps the source to an inaudible loop and keeps playing. Swapping the source of an element
     * that is already playing is reliable on iOS; starting fresh playback from a backgrounded
     * context is not - which is the whole reason this holds instead of pausing and resuming.
     */
    private enterSilentHold() {
        this.heldTrackSrc = this.activeBlobUrl;
        this.heldPosition = this.audio.currentTime;
        this.heldDuration = this.audio.duration;
        this.holding = true;

        SessionRecorder.record('act', `HOLD an @${this.heldPosition.toFixed(2)}`);
        this.visualizationAudio.pause();
        this.visualizationData.next(new Float32Array());
        // 60 s rather than a few seconds: the loop boundary is the only moment where
        // IsPlayingAudio could conceivably flicker, so make it rare.
        this.silentHoldSrc ??= createSilentWav(60);
        this.audio.loop = true;
        this.audio.src = this.silentHoldSrc;
        this.audio.play().catch((error) => {
            console.warn('silent hold could not start, falling back to a real pause', error);
            this.releaseSilentHold(false);
            this.audio.pause();
        });
    }

    /** @param resume whether to continue the held track or leave it paused at its position. */
    private releaseSilentHold(resume: boolean) {
        if (!this.holding) return;

        const trackSrc = this.heldTrackSrc;
        const position = this.heldPosition;
        this.holding = false;
        this.heldTrackSrc = undefined;
        this.audio.loop = false;

        if (!trackSrc) return;

        SessionRecorder.record('act', `HOLD aus @${position.toFixed(2)} resume=${resume ? 1 : 0}`);
        this.audio.src = trackSrc;
        if (this.visualizationRouted) this.visualizationAudio.src = trackSrc;

        const restore = () => {
            if (position > 0) this.audio.currentTime = position;
            this.syncVisualization();
            if (resume) this.playVisualization();
        };
        this.audio.addEventListener('loadedmetadata', restore, { once: true });

        if (resume) this.audio.play().catch((error) => console.warn('held track could not resume', error));
        else this.audio.pause();
    }

    async play() {
        this.intendedPlaying = true;
        void this.resumeAudioContext();

        if (this.holding) {
            this.releaseSilentHold(true);
            if (navigator.mediaSession) navigator.mediaSession.playbackState = 'playing';
            this.playVisualization();
            return;
        }

        this.recoverSource();

        try {
            await this.audio.play();
        } catch (error) {
            this.intendedPlaying = false;
            if (navigator.mediaSession) navigator.mediaSession.playbackState = 'paused';
            throw error;
        }

        if (navigator.mediaSession) navigator.mediaSession.playbackState = 'playing';
        this.syncVisualization();
        this.playVisualization();
    }

    stop() {
        this.intendedPlaying = false;
        this.holding = false;
        this.heldTrackSrc = undefined;
        this.audio.loop = false;
        this.pendingLoad?.abort();
        this.pendingLoad = undefined;

        this.audio.pause();
        this.visualizationAudio.pause();
        this.releaseSource();

        this.audio.removeAttribute('src');
        this.visualizationAudio.removeAttribute('src');
        this.audio.load();
        this.visualizationAudio.load();

        if (navigator.mediaSession) {
            navigator.mediaSession.playbackState = 'none';
            navigator.mediaSession.metadata = null;
            navigator.mediaSession.setPositionState?.();
        }
    }

    /**
     * The single entry point for "make this track the active one". A track change always assigns
     * the source, whether or not playback is running, so the element can never end up playing a
     * different track than the caller asked for.
     *
     * @param play `undefined` toggles, `true`/`false` force the resulting playback state.
     */
    async setTrack(blob: Blob | null | undefined, track: MusicModel, play?: boolean) {
        if (!blob) throw new Error(`track ${track.hash} has no cached audio`);

        if (this.holding) {
            this.holding = false;
            this.heldTrackSrc = undefined;
            this.audio.loop = false;
        }

        const isSameTrack = this.activeTrackHash == track.hash;
        const shouldPlay = play ?? (isSameTrack ? this.audio.paused : true);
        const position = isSameTrack ? this.audio.currentTime : 0;

        if (!isSameTrack || this.audio.readyState == HTMLMediaElement.HAVE_NOTHING) {
            this.recoveryAttempts = 0;
            const loaded = this.waitForMetadata();
            this.assignSource(blob);
            this.activeTrack = track;
            this.activeTrackHash = track.hash;
            this.publishMetadata(track);
            await loaded;
        }

        // Seek before starting, otherwise resuming audibly restarts from the beginning.
        if (position > 0 && Math.abs(this.audio.currentTime - position) > 0.05) this.audio.currentTime = position;

        if (shouldPlay) await this.play();
        else this.pause();

        this.audioProgress.next(null);
    }

    private publishMetadata(track: MusicModel) {
        if (!('mediaSession' in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.name,
            artist: track.author ?? 'Unbekannter Autor',
            album: track.source ?? undefined,
        });
    }

}
