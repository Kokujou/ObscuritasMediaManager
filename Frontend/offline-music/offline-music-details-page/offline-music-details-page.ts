import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { changePage } from '../../extensions/url.extension';
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
        var position = this.currentTrackPosition;
        var minutes = Math.floor(position / 60);
        var seconds = Math.floor(position - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    protected get currentTrackDurationText() {
        var duration = this.currentTrackDuration;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

        this.currentPlaylist = this.playlistId
            ? (OfflineSession.temporaryPlaylists[this.playlistId] ??
              OfflineSession.playlists.find((x) => x.id == this.playlistId)?.tracks)
            : null;

        const seedString = sessionStorage.getItem(this.seedSessionKey);
        if (this.randomize && seedString && this.currentPlaylist) {
            const index = this.index;
            const seed = Number.parseInt(seedString);
            this.currentPlaylist = this.currentPlaylist.randomize(seed);

            this.changeToTrackAt(index);
        }

        await this.cachePlaylistTracks();

        this.toggleTrack();
        OfflineSession.audio.pause();
        this.requestFullUpdate();

        window.addEventListener('click', (e) => (this.playlistExpanded = false), { signal: this.abortController.signal });
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('previoustrack', () =>
                this.changeToTrackAt(this.index - 1, new Event('dummy')),
            );
            navigator.mediaSession.setActionHandler('nexttrack', () => this.changeToTrackAt(this.index + 1, new Event('dummy')));
        }

        this.subscriptions.push(
            OfflineSession.audio.onNextTrack.subscribe(() => {
                if (this.playlistId) this.changeToTrackAt(this.index + 1, new Event('dummy'));
            }),
        );
    }

    override render() {
        return renderOfflineMusicDetailsPage.call(this);
    }

    async cachePlaylistTracks() {
        this.caching = true;
        const playlist = this.currentPlaylist ?? (this.currentTrack ? [this.currentTrack.hash] : []);
        if (playlist.length) await OfflineSession.prefetchAdjacent(playlist, this.index);
        this.caching = false;
    }

    toggleTrack(event?: Event) {
        try {
            OfflineSession.audio.toggleTrackSync(
                OfflineSession.playedTracks.get(this.currentTrack!.hash)!,
                this.currentTrack!,
                event,
            );
        } catch {
            this.changeToTrackAt(this.index + 1, event);
        }
        this.requestFullUpdate();
    }

    changeToTrackAt(index: number, event?: Event) {
        this.playlistExpanded = false;
        if (!this.currentPlaylist || index < 0 || index >= this.currentPlaylist.length || this.index == index) return;
        this.index = index;

        OfflineSession.audio.toggleTrackSync(
            OfflineSession.playedTracks.get(this.currentTrack!.hash)!,
            this.currentTrack!,
            event,
            true,
        );

        // Slide the window to the new index. Fire-and-forget so the next
        // MediaSession handler always finds its buffer on the fast path.
        OfflineSession.prefetchAdjacent(this.currentPlaylist, this.index);
        this.requestFullUpdate();
        this.refreshQuery();
    }

    async navigateToTrack(index: number, event: Event) {
        if (!this.currentPlaylist) return;
        this.caching = true;
        await OfflineSession.prefetchAdjacent(this.currentPlaylist, index);
        this.caching = false;
        this.changeToTrackAt(index, event);
    }

    async shufflePlaylist(event?: Event) {
        if (!this.playlistId || !this.currentPlaylist) return;

        this.randomize = true;

        const seed = Math.floor(Math.random() * 10_000_000);
        sessionStorage.setItem(this.seedSessionKey, seed.toString());

        this.currentPlaylist = (
            OfflineSession.temporaryPlaylists[this.playlistId] ??
            OfflineSession.playlists.find((x) => x.id == this.playlistId)?.tracks
        ).randomize(seed);
        this.caching = true;
        await OfflineSession.prefetchAdjacent(this.currentPlaylist, 0);
        this.caching = false;
        this.changeToTrackAt(0, event);
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

        OfflineSession.audio.stop();
    }
}
