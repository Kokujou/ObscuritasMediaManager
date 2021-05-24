import { MusicModel } from '../../data/music.model.js';
import { LitElement } from '../../exports.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { MusicService } from '../../services/music.service.js';
import { PlaylistService } from '../../services/playlist.service.js';
import { renderMusicPlaylistStyles } from './music-playlist-popup.css.js';
import { renderMusicPlaylist } from './music-playlist-popup.html.js';

export class MusicPlaylistPopup extends LitElement {
    static get styles() {
        return renderMusicPlaylistStyles();
    }

    static get properties() {
        return {};
    }

    static popup(guid) {
        window.open(`/?guid=${guid}#music-playlist`, '_blank', 'location=yes,height=480,width=720,menubar=yes,toolbar=yes,status=yes');
    }

    constructor() {
        super();
        /** @type {string[]} */ this.playlist;
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {MusicModel} */ this.currentTrack;

        console.log('initalized');

        this.initializeData();
    }

    async initializeData() {
        var guid = getQueryValue('guid');

        this.playlist = await PlaylistService.getTemporaryPlaylist(guid);
        this.currentTrack = await MusicService.get(this.playlist[this.currentTrackIndex]);
        this.requestUpdate(undefined);
    }

    render() {
        return renderMusicPlaylist(this);
    }
}
