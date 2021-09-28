import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { MusicFilterOptions } from '../../data/music-filter-options.js';
import { MusicModel } from '../../data/music.model.js';
import { Subscription } from '../../data/observable.js';
import { Pages } from '../../data/pages.js';
import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { NoteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { pauseIcon } from '../../resources/icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/icons/music-player-icons/play-icon.svg.js';
import { importFiles } from '../../services/extensions/file.extension.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { MusicFilterService } from '../../services/music-filter.service.js';
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
        return this.filteredTracks.slice(0, 6 + 3 * this.currentPage);
    }

    get filteredTracks() {
        var filteredTracks = [...this.musicTracks];

        MusicFilterService.applyArrayFilter(filteredTracks, this.filter.genres, 'genres');
        MusicFilterService.applyArrayFilter(filteredTracks, this.filter.instrumentTypes, 'instrumentTypes');
        MusicFilterService.applyArrayFilter(filteredTracks, this.filter.instruments, 'instrumentNames');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.instrumentations, 'instrumentation');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.languages, 'language');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.nations, 'nation');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.moods, 'mood');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.participants, 'participants');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.ratings, 'rating', true);

        filteredTracks = filteredTracks.filter((track) =>
            track.displayName.toLowerCase().includes((this.filter.title || '').toLowerCase())
        );

        if (this.filter.complete != CheckboxState.Ignore)
            filteredTracks = filteredTracks.filter((track) => track.complete == (this.filter.complete == CheckboxState.Allow));

        return filteredTracks;
    }

    constructor() {
        super();

        /** @type {MusicModel[]} */ this.musicTracks = [];
        /** @type {string} */ this.currentTrackSrc = '';
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {boolean} */ this.isPaused = false;
        /** @type {MusicFilterOptions} */ this.filter = new MusicFilterOptions();
        /** @type {Subscription[]} */ this.subcriptions = [];

        this.currentPage = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Musik';
        setFavicon(NoteIcon());
        this.subcriptions.push(
            session.instruments.subscribe(() => {
                this.initializeData();
                this.requestUpdate(undefined);
            })
        );
    }

    async initializeData() {
        this.musicTracks = await MusicService.getAll();
        var localSearchString = localStorage.getItem(`music.search`);
        if (localSearchString) this.filter = JSON.parse(localSearchString);
        await this.requestUpdate(undefined);
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
        var guid = await PlaylistService.createTemporaryPlaylist(this.filteredTracks.map((x) => x.id));
        changePage(Pages.musicPlaylist.routes[0], `?guid=${guid}&track=0`);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MusicPage.processFiles(fileImportResult.files, fileImportResult.basePath);
        } catch (err) {
            console.error('the import of files was aborted', err);
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

    /**
     * @param {MusicFilterOptions} filter
     */
    updateFilter(filter) {
        this.filter = filter;
        localStorage.setItem(`music.search`, JSON.stringify(this.filter));
        this.requestUpdate(undefined);
    }

    /**
     * @param {MusicModel} track
     */
    editTrack(track) {
        changePage(Pages.musicPlaylist.routes[0], `?track=${track.id}`);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subcriptions.forEach((x) => x.unsubscribe());
    }
}
