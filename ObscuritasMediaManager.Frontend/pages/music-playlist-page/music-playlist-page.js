import { MusicModel } from '../../data/music.model.js';
import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { NoteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { changePage, getQueryValue } from '../../services/extensions/url.extension.js';
import { MusicService } from '../../services/music.service.js';
import { PlaylistService } from '../../services/playlist.service.js';
import { renderMusicPlaylistStyles } from './music-playlist-page.css.js';
import { renderMusicPlaylist } from './music-playlist-page.html.js';

export class MusicPlaylistPage extends LitElement {
    static get styles() {
        return renderMusicPlaylistStyles();
    }

    static get properties() {
        return {};
    }

    get paused() {
        var audioElement = this.shadowRoot.querySelector('audio');
        return audioElement?.paused;
    }

    get audioSource() {
        if (this.currentTrack && this.currentTrack.src) return `/ObscuritasMediaManager/api/file/audio?audioPath=${this.currentTrack.src}`;
        return null;
    }

    get paginatedPlaylistTracks() {
        return this.playlist.slice(0, this.maxPlaylistItems);
    }

    constructor() {
        super();
        /** @type {MusicModel[]} */ this.playlist = [];
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {MusicModel} */ this.currentTrack = new MusicModel();
        /** @type {MusicModel} */ this.updatedTrack = new MusicModel();
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {number} */ this.maxPlaylistItems = 20;

        this.initializeData();
        window.onunload = async (e) => {
            alert('test');
            e.preventDefault();
            e.returnValue = '';
            await this.updateTrack();
            return;
        };
    }
    connectedCallback() {
        super.connectedCallback();
        setFavicon(NoteIcon());
        this.updateIntervalCall = setInterval(async () => {
            await this.updateTrack();
        }, 10000);
    }

    async initializeData() {
        var guid = getQueryValue('guid');
        var trackId = getQueryValue('track');

        this.id = guid;
        this.playlist = await PlaylistService.getTemporaryPlaylist(guid);
        this.currentTrackIndex = Number.parseInt(trackId);
        this.currentTrack = Object.assign(new MusicModel(), this.playlist[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist[this.currentTrackIndex]);
        document.title = this.currentTrack.displayName;
        this.requestUpdate(undefined);
    }

    render() {
        return renderMusicPlaylist(this);
    }

    toggleCurrentTrack() {
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');

        if (audioElement.paused) audioElement.play();
        else audioElement.pause();

        this.requestUpdate(undefined);
    }

    changeTrack(offset) {
        this.updateTrack();

        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');
        audioElement.pause();
        this.currentTrackIndex += offset;
        this.currentTrack = Object.assign(new MusicModel(), this.playlist[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist[this.currentTrackIndex]);
        changePage(session.currentPage.current(), `?guid=${this.id}&track=${this.currentTrackIndex}`);
        this.requestUpdate(undefined);
    }

    changeVolume(newVolume) {
        this.currentVolumne = newVolume / 100;
        this.requestUpdate(undefined);
    }

    /**
     * @param {keyof  MusicModel} property
     * @param {any} value
     */
    changeProperty(property, value) {
        if (property == 'displayName') return;
        this.updatedTrack[property] = value;
        this.requestUpdate(undefined);
    }

    loadMoreTracks() {
        if (this.playlist.length > this.maxPlaylistItems) this.maxPlaylistItems += 10;
        this.requestUpdate(undefined);
    }

    async updateTrack() {
        if (JSON.stringify(this.updatedTrack) == JSON.stringify(this.currentTrack)) return;
        try {
            await MusicService.update(this.updatedTrack);
        } catch (err) {
            console.error(err);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this.updateIntervalCall);
        this.updateTrack();
    }
}
