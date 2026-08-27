export interface RecordedEntry {
    t: number;
    kind: 'act' | 'evt' | 'gap';
    text: string;
}

const StorageKey = 'offline-music.session-log';
const EnabledKey = 'offline-music.session-log-enabled';
const MaxEntries = 400;
const HeartbeatInterval = 1000;
const GapThreshold = 2500;

/**
 * Records what happens to playback while the app is backgrounded, so a failure that only occurs
 * on a locked phone can be read afterwards instead of reproduced. There is no console on iOS, so
 * the log is rendered in the app (import page) and copyable.
 *
 * The heartbeat is the actual measurement: JS does not run while the WebContent process is
 * suspended, so a gap between two ticks is direct evidence of suspension - and its length
 * distinguishes that from a torn-down media element, which leaves events but no gap.
 */
export class SessionRecorder {
    private static entries: RecordedEntry[] = [];
    private static heartbeat?: ReturnType<typeof setInterval>;
    private static lastTick = 0;
    private static flushTimer?: ReturnType<typeof setTimeout>;
    private static loaded = false;
    /**
     * Supplies the playback state to stamp onto a gap. A gap only proves JS did not run - whether
     * the audio ran through it is decided by the position, so the position has to be on that line.
     */
    public static stateProvider?: () => string;

    static get enabled() {
        return localStorage.getItem(EnabledKey) === 'true';
    }

    static set enabled(value: boolean) {
        localStorage.setItem(EnabledKey, String(value));
        if (value) this.start();
        else this.stop();
    }

    static start() {
        this.load();
        if (this.heartbeat) return;

        this.lastTick = Date.now();
        this.heartbeat = setInterval(() => this.tick(), HeartbeatInterval);
        this.record('act', 'recorder gestartet');
    }

    static stop() {
        clearInterval(this.heartbeat);
        this.heartbeat = undefined;
    }

    static record(kind: RecordedEntry['kind'], text: string) {
        if (!this.enabled) return;

        this.load();
        this.entries.push({ t: Date.now(), kind, text });
        if (this.entries.length > MaxEntries) this.entries = this.entries.slice(-MaxEntries);
        this.flush();
    }

    static read(): RecordedEntry[] {
        this.load();
        return this.entries.slice();
    }

    static get gaps() {
        return this.read().filter((entry) => entry.kind == 'gap');
    }

    static clear() {
        this.entries = [];
        localStorage.removeItem(StorageKey);
    }

    static asText() {
        return this.read()
            .map((entry) => new Date(entry.t).toISOString() + '  ' + entry.text)
            .join('\n');
    }

    private static tick() {
        const now = Date.now();
        const drift = now - this.lastTick;
        this.lastTick = now;
        if (drift <= GapThreshold) return;

        const state = this.stateProvider?.() ?? '';
        this.record('gap', `LÜCKE ${(drift / 1000).toFixed(1)} s - kein JS gelaufen  ${state}`);
    }

    private static load() {
        if (this.loaded) return;
        this.loaded = true;
        try {
            this.entries = JSON.parse(localStorage.getItem(StorageKey) ?? '[]') as RecordedEntry[];
        } catch {
            this.entries = [];
        }
    }

    /** Batched: a burst of media events must not mean a write per event. */
    private static flush() {
        clearTimeout(this.flushTimer);
        this.flushTimer = setTimeout(() => {
            try {
                localStorage.setItem(StorageKey, JSON.stringify(this.entries.slice(-MaxEntries)));
            } catch {
                // storage full or unavailable - the in-memory log still works for this session
            }
        }, 400);
    }
}
