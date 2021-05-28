import { MusicModel } from '../../data/music.model.js';
import { LitElement } from '../../exports.js';
import { NoteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
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

    constructor() {
        super();
        /** @type {MusicModel[]} */ this.playlist = [];
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {MusicModel} */ this.currentTrack = new MusicModel();
        /** @type {number} */ this.currentVolumne = 0.1;

        this.initializeData();
    }
    connectedCallback() {
        super.connectedCallback();
        setFavicon(NoteIcon());
    }

    async initializeData() {
        var guid = getQueryValue('guid');

        this.playlist = await PlaylistService.getTemporaryPlaylist(guid);
        this.currentTrack = Object.assign(new MusicModel(), this.playlist[this.currentTrackIndex]);
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
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');
        audioElement.pause();
        this.currentTrackIndex += offset;
        this.currentTrack = Object.assign(new MusicModel(), this.playlist[this.currentTrackIndex]);
        this.requestUpdate(undefined);
    }

    changeVolume(newVolume) {
        this.currentVolumne = newVolume / 100;
        this.requestUpdate(undefined);
    }

    /**
     * @param {keyof  MusicModel} property
     * @param {any} mood
     */
    changeProperty(property, mood) {
        if (property == 'displayName') return;
        this.currentTrack[property] = mood;
        this.requestUpdate(undefined);
    }
}
