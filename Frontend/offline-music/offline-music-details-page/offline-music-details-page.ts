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

    @state() public declare trackHash?: string;
    @state() public declare playlistId?: string;
    @state() public declare index: number;
    @state() public declare randomize: boolean;

    @state() protected declare playlistExpanded: boolean;
    protected declare currentPlaylist: string[] | null;

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
    }

    async connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(OfflineSession.audioProgress.subscribe(() => this.requestFullUpdate()));

        this.currentPlaylist = this.playlistId
            ? OfflineSession.temporaryPlaylists[this.playlistId] ??
              OfflineSession.playlists.find((x) => x.id == this.playlistId)?.tracks
            : null;

        const seedString = sessionStorage.getItem(this.seedSessionKey);
        if (this.randomize && seedString && this.currentPlaylist) {
            const index = this.index;
            const seed = Number.parseInt(seedString);
            this.currentPlaylist = this.currentPlaylist.randomize(seed);

            this.changeToTrackAt(index);
        }

        await this.toggleTrack();
        OfflineSession.audio.pause();
        this.requestFullUpdate();

        window.addEventListener('click', (e) => (this.playlistExpanded = false), { signal: this.abortController.signal });
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('previoustrack', () =>
                this.changeToTrackAt(this.index - 1, new Event('dummy'))
            );
            navigator.mediaSession.setActionHandler('nexttrack', () => this.changeToTrackAt(this.index + 1, new Event('dummy')));
            navigator.mediaSession.setActionHandler('pause', () => this.toggleTrack(new Event('dummy')));
            navigator.mediaSession.setActionHandler('play', () => this.toggleTrack(new Event('dummy')));
        }

        OfflineSession.audio.addEventListener('ended', (e: Event) => this.changeToTrackAt(this.index + 1, e));
    }

    override render() {
        return renderOfflineMusicDetailsPage.call(this);
    }

    async toggleTrack(event?: Event) {
        await OfflineSession.toggleTrack(this.currentTrack!, event);
        await this.requestFullUpdate();
    }

    async changeToTrackAt(index: number, event?: Event) {
        this.playlistExpanded = false;
        if (!this.currentPlaylist || index < 0 || index >= this.currentPlaylist.length || this.index == index) return;
        this.index = index;

        await OfflineSession.toggleTrack(this.currentTrack!, event, true);
        await this.requestFullUpdate();
        this.refreshQuery();
    }

    shufflePlaylist(event?: Event) {
        if (!this.playlistId || !this.currentPlaylist) return;

        this.randomize = true;

        const seed = Math.floor(Math.random() * 10_000_000);
        sessionStorage.setItem(this.seedSessionKey, seed.toString());

        this.currentPlaylist = (
            OfflineSession.temporaryPlaylists[this.playlistId] ??
            OfflineSession.playlists.find((x) => x.id == this.playlistId)?.tracks
        ).randomize(seed);
        this.changeToTrackAt(0, event);
        this.requestFullUpdate();
    }

    refreshQuery() {
        changePage(
            OfflineMusicDetailsPage,
            { index: this.index, playlistId: this.playlistId, trackHash: this.trackHash, randomize: this.randomize },
            false
        );
    }
}
