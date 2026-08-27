import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { changePage } from '../../extensions/url.extension';
import { OfflineMusicPage } from '../offline-music-page/offline-music-page';
import { OfflineSession } from '../session';
import { renderOfflineMusicDetailsPageStyles } from './offline-music-details-page.css';
import { renderOfflineMusicDetailsPage } from './offline-music-details-page.html';

@customElement('offline-music-details-page')
export class OfflineMusicDetailsPage extends LitElementBase {
    static isPage = true as const;

    static override get styles() {
        return renderOfflineMusicDetailsPageStyles();
    }

    @state() declare public trackHash?: string;
    @state() declare public playlistId?: string;
    @state() declare public index: number;
    @state() declare public randomize: boolean;
    @state() declare public caching: boolean;

    @state() declare protected playlistExpanded: boolean;
    declare protected currentPlaylist: string[] | null;

    protected get currentTrack() {
        const trackHash = this.trackHash ?? this.currentPlaylist?.at(this.index);
        return OfflineSession.musicMetadata.find((x) => x.hash == trackHash);
    }

    protected get nextTrack() {
        const trackHash = this.trackHash ?? this.currentPlaylist?.at(this.index + 1);
        return OfflineSession.musicMetadata.find((x) => x.hash == trackHash);
    }

    protected get currentTrackPosition() {
        return OfflineSession.audio.currentTime;
    }

    protected get currentTrackDuration() {
        return OfflineSession.audio.duration;
    }

    protected get currentTrackPositionText() {
        return this.formatTime(this.currentTrackPosition);
    }

    protected get currentTrackDurationText() {
        return this.formatTime(this.currentTrackDuration);
    }

    protected get seedSessionKey() {
        return `playlist.${this.playlistId}.seed`;
    }

    constructor() {
        super();
        this.index = 0;
        this.caching = true;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(OfflineSession.audio.audioProgress.subscribe(() => this.requestFullUpdate()));

        this.currentPlaylist = this.playlistId ? this.resolvePlaylist(this.playlistId) : null;

        const seedString = sessionStorage.getItem(this.seedSessionKey);
        if (this.randomize && seedString && this.currentPlaylist) {
            const seed = Number.parseInt(seedString);
            if (Number.isFinite(seed)) this.currentPlaylist = this.currentPlaylist.randomize(seed);
        }

        if (!this.currentTrack) {
            changePage(OfflineMusicPage);
            return;
        }

        await this.cachePlaylistTracks();
        await this.loadCurrentTrack(false);
        this.requestFullUpdate();

        window.addEventListener('click', () => (this.playlistExpanded = false), { signal: this.abortController.signal });

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('previoustrack', () => void this.changeToTrackAt(this.index - 1));
            navigator.mediaSession.setActionHandler('nexttrack', () => void this.changeToTrackAt(this.index + 1));
        }

        this.subscriptions.push(
            OfflineSession.audio.onNextTrack.subscribe(() => {
                if (this.playlistId) void this.changeToTrackAt(this.index + 1);
            }),
        );
    }

    override render() {
        return renderOfflineMusicDetailsPage.call(this);
    }

    formatTime(seconds: number) {
        if (!Number.isFinite(seconds) || seconds < 0) return '--:--';

        const minutes = Math.floor(seconds / 60);
        const remainder = Math.floor(seconds - minutes * 60);
        return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
    }

    async cachePlaylistTracks() {
        this.caching = true;
        this.requestFullUpdate();
        try {
            const playlist = this.currentPlaylist ?? (this.currentTrack ? [this.currentTrack.hash] : []);
            if (playlist.length) await OfflineSession.prefetchAdjacent(playlist, this.index);
        } finally {
            this.caching = false;
            this.requestFullUpdate();
        }
    }

    /** Play/pause button: always acts on the track the UI is showing. */
    async toggleTrack() {
        await this.loadCurrentTrack(undefined);
    }

    /**
     * Moves to `index` and starts it. Unlike the previous implementation this never returns early
     * for the current index - shuffle reorders the playlist under the same index and the element
     * has to follow, otherwise the UI and the audio drift apart.
     */
    async changeToTrackAt(index: number, play = true) {
        this.playlistExpanded = false;
        if (!this.currentPlaylist) return;
        if (index < 0 || index >= this.currentPlaylist.length) return;

        const previousIndex = this.index;
        this.index = index;
        this.requestFullUpdate();

        if (!(await this.loadCurrentTrack(play))) {
            this.index = previousIndex;
            this.requestFullUpdate();
            return;
        }

        void OfflineSession.prefetchAdjacent(this.currentPlaylist, this.index);
        this.refreshQuery();
    }

    async navigateToTrack(index: number) {
        if (!this.currentPlaylist) return;

        this.caching = true;
        this.requestFullUpdate();
        try {
            await OfflineSession.prefetchAdjacent(this.currentPlaylist, index);
        } finally {
            this.caching = false;
        }
        await this.changeToTrackAt(index);
    }

    async shufflePlaylist() {
        if (!this.playlistId) return;

        const source = this.resolvePlaylist(this.playlistId);
        if (!source?.length) return;

        this.randomize = true;
        const seed = Math.floor(Math.random() * 10_000_000);
        sessionStorage.setItem(this.seedSessionKey, seed.toString());
        this.currentPlaylist = source.randomize(seed);
        this.index = 0;

        this.caching = true;
        this.requestFullUpdate();
        try {
            await OfflineSession.prefetchAdjacent(this.currentPlaylist, 0);
        } finally {
            this.caching = false;
        }

        await this.loadCurrentTrack(true);
        this.refreshQuery();
        this.requestFullUpdate();
    }

    refreshQuery() {
        changePage(
            OfflineMusicDetailsPage,
            { index: this.index, playlistId: this.playlistId, trackHash: this.trackHash, randomize: this.randomize },
            false,
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        }

        OfflineSession.audio.stop();
    }

    /** PlaylistModel.tracks holds full MusicModels, the player works on hashes. */
    private resolvePlaylist(playlistId: string): string[] | null {
        const temporary = OfflineSession.temporaryPlaylists[playlistId];
        if (temporary) return temporary;

        const stored = OfflineSession.playlists.find((x) => x.id == playlistId);
        return stored ? stored.tracks.map((track) => track.hash) : null;
    }

    /**
     * Hands the current track to the AudioService and reports whether it took. A track whose blob
     * is missing or undecodable is skipped rather than silently leaving the UI on a track that is
     * not playing; the skip budget keeps a fully broken cache from recursing.
     */
    private async loadCurrentTrack(play: boolean | undefined, remainingSkips = 3): Promise<boolean> {
        const track = this.currentTrack;
        if (!track) return false;

        try {
            await OfflineSession.playTrack(track, play);
            this.requestFullUpdate();
            return true;
        } catch (error) {
            console.error(`track ${track.hash} could not be played`, error);
            if (remainingSkips <= 0 || !this.currentPlaylist) return false;

            const next = this.index + 1;
            if (next >= this.currentPlaylist.length) return false;

            this.index = next;
            return await this.loadCurrentTrack(play, remainingSkips - 1);
        }
    }
}
