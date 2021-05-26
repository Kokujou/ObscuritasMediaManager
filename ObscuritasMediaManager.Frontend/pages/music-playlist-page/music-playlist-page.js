import { MusicModel } from '../../data/music.model.js';
import { LitElement } from '../../exports.js';
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

    constructor() {
        super();
        /** @type {MusicModel[]} */ this.playlist = [];
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {MusicModel} */ this.currentTrack = new MusicModel();

        this.initializeData();
    }

    async initializeData() {
        var guid = getQueryValue('guid');

        this.playlist = await PlaylistService.getTemporaryPlaylist(guid);
        this.currentTrack = this.playlist[this.currentTrackIndex];
        console.log(this.currentTrack);
        this.requestUpdate(undefined);
    }

    render() {
        return renderMusicPlaylist(this);
    }

    toggleCurrentTrack() {
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');

        if (audioElement.paused) audioElement.play();
        else audioElement.pause();
    }

    changeMood(mood) {
        this.currentTrack.mood = mood;
        this.requestUpdate(undefined);
        console.log(mood);
    }
}
