import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
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

    protected get currentPlaylist() {
        return this.playlistId
            ? OfflineSession.temporaryPlaylists[this.playlistId] ??
                  OfflineSession.playlists.find((x) => x.id == this.playlistId)?.tracks
            : null;
    }

    protected get currentTrack() {
        const trackHash = this.trackHash ?? this.currentPlaylist?.at(this.index);
        return OfflineSession.musicMetadata.find((x) => x.hash == trackHash);
    }

    protected get nextTrack() {
        const trackHash = this.trackHash ?? this.currentPlaylist?.at(this.index + 1);
        return OfflineSession.musicMetadata.find((x) => x.hash == trackHash);
    }

    get currentTrackPosition() {
        return OfflineSession.audio.currentTime;
    }

    get currentTrackDuration() {
        return OfflineSession.audio.duration;
    }

    get currentTrackPositionText() {
        var position = this.currentTrackPosition;
        var minutes = Math.floor(position / 60);
        var seconds = Math.floor(position - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    get currentTrackDurationText() {
        var duration = this.currentTrackDuration;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    constructor() {
        super();
        this.index = 0;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(OfflineSession.audioProgress.subscribe(() => this.requestFullUpdate()));

        await this.toggleTrack();
        OfflineSession.audio.pause();
        this.requestFullUpdate();
    }

    override render() {
        return renderOfflineMusicDetailsPage.call(this);
    }

    async toggleTrack(event?: Event) {
        await OfflineSession.toggleTrack(this.currentTrack!, event);
        await this.requestFullUpdate();
    }

    async playNextTrack(event: Event) {
        if (this.index >= this.currentPlaylist?.length!) return;
        this.index++;

        await OfflineSession.toggleTrack(this.currentTrack!, event, true);
        await this.requestFullUpdate();
    }

    async playPreviousTrack(event: Event) {
        if (this.index <= 0) return;
        this.index--;

        await OfflineSession.toggleTrack(this.currentTrack!, event, true);
        await this.requestFullUpdate();
    }
}
