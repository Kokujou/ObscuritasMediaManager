import { MusicModel } from '../../data/music.model.js';
import { Pages } from '../../data/pages.js';
import { LitElement } from '../../exports.js';
import { NoteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { pauseIcon } from '../../resources/icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/icons/music-player-icons/play-icon.svg.js';
import { importFiles } from '../../services/extensions/file.extension.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { MusicService } from '../../services/music.service.js';
import { PlaylistService } from '../../services/playlist.service.js';
import { renderMusicPageStyles } from './music-page.css.js';
import { renderMusicPage } from './music-page.html.js';

export class MusicPage extends LitElement {
    static get styles() {
        return renderMusicPageStyles();
    }

    static get properties() {
        return {};
    }

    get paginatedTracks() {
        return this.musicTracks.slice(0, 6 + 3 * this.currentPage);
    }

    get filteredTracks() {
        return this.musicTracks;
    }

    constructor() {
        super();
        document.title = 'Musik';
        /** @type {MusicModel[]} */ this.musicTracks = [];
        /** @type {string} */ this.currentTrackSrc = '';
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {boolean} */ this.isPaused = false;
        this.currentPage = 0;
        this.initializeData();
    }

    async initializeData() {
        this.musicTracks = await MusicService.getAll();
        this.requestUpdate(undefined);
    }

    render() {
        return renderMusicPage(this);
    }

    /**
     * @param {MusicModel} track
     */
    getTrackIcon(track) {
        var trackSrc = `/ObscuritasMediaManager/api/file/audio?audioPath=${track.src}`;
        if (this.currentTrackSrc != trackSrc) return NoteIcon();
        if (this.isPaused) return playIcon();
        return pauseIcon();
    }

    loadNext() {
        this.currentPage++;
        this.requestUpdate(undefined);
    }

    changeVolume(newVolume) {
        this.currentVolumne = newVolume / 100;
        this.requestUpdate(undefined);
    }

    /**
     * @param {MusicModel} track
     */
    async toggleMusic(track) {
        var trackSrc = `/ObscuritasMediaManager/api/file/audio?audioPath=${track.src}`;
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#current-track');
        if (this.currentTrackSrc == trackSrc && !audioElement.paused) audioElement.pause();
        else if (this.currentTrackSrc == trackSrc && audioElement.paused) audioElement.play();
        this.isPaused = audioElement.paused;
        this.requestUpdate(undefined);
        if (this.currentTrackSrc == trackSrc) return;

        this.currentTrackSrc = trackSrc;
        await this.requestUpdate(undefined);
        audioElement.play();
        this.isPaused = audioElement.paused;
        this.requestUpdate(undefined);
    }

    async playPlaylist() {
        var guid = await PlaylistService.createTemporaryPlaylist(this.musicTracks.map((x) => x.id));
        changePage(Pages.musicPlaylist.routes[0], `?guid=${guid}`);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MusicPage.processFiles(fileImportResult.files, fileImportResult.basePath);
        } catch {
            console.info('the import of files was aborted');
        }
    }

    /**
     * @param {FileList} files
     * @param {string} basePath
     */
    static async processFiles(files, basePath) {
        var musickTracks = [];
        for (var i = 0; i < files.length; i++) {
            try {
                var track = MusicModel.fromFile(files[i], basePath);
                if (musickTracks.some((x) => x.name == track.name)) continue;
                musickTracks.push(track);
            } catch (err) {
                continue;
            }
        }

        try {
            await MusicService.batchCreateMusicTracks(musickTracks);
        } catch (err) {
            console.error(err);
        }
    }
}
