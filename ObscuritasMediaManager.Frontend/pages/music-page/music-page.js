import { PaginatedScrolling } from '../../advanced-components/paginated-scrolling/paginated-scrolling.js';
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { MusicFilterOptions } from '../../data/music-filter-options.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { Subscription } from '../../data/observable.js';
import { Pages } from '../../data/pages.js';
import { session } from '../../data/session.js';
import { MessageDialog } from '../../dialogs/message-dialog/message-dialog.js';
import { SelectOptionsDialog } from '../../dialogs/select-options-dialog/select-options-dialog.js';
import { LitElement } from '../../exports.js';
import { noteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { pauseIcon } from '../../resources/icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/icons/music-player-icons/play-icon.svg.js';
import { CleanupService, MusicService, PlaylistService } from '../../services/backend.services.js';
import { sortyBy } from '../../services/extensions/array.extensions.js';
import { importFiles } from '../../services/extensions/file.extension.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { MusicFilterService } from '../../services/music-filter.service.js';
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

        MusicFilterService.applyArrayFilter(filteredTracks, this.filter.instrumentTypes, 'instrumentTypes');
        MusicFilterService.applyArrayFilter(filteredTracks, this.filter.instruments, 'instruments');
        MusicFilterService.applyArrayFilter(filteredTracks, this.filter.genres, 'genres');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.instrumentations, 'instrumentation');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.languages, 'language');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.nations, 'nation');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.moods, 'mood');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.participants, 'participants');
        MusicFilterService.applyPropertyFilter(filteredTracks, this.filter.ratings, 'rating');
        filteredTracks = filteredTracks.filter(
            (track) =>
                track.displayName.toLowerCase().includes((this.filter.search || '').toLowerCase()) ||
                track.path.toLowerCase().includes((this.filter.search || '').toLowerCase())
        );

        if (this.filter.complete != CheckboxState.Ignore)
            filteredTracks = filteredTracks.filter((track) => track.complete == (this.filter.complete == CheckboxState.Allow));

        var sorted = filteredTracks;
        if (this.sortingProperty != 'unset') sorted = sortyBy(filteredTracks, this.sortingProperty);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    constructor() {
        super();

        /** @type {ExtendedMusicModel[]} */ this.musicTracks = [];
        /** @type {string} */ this.currentTrackPath = '';
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {boolean} */ this.isPaused = true;
        /** @type {MusicFilterOptions} */ this.filter = new MusicFilterOptions();
        /** @type {Subscription[]} */ this.subcriptions = [];
        /** @type {boolean} */ this.selectionMode = false;
        /** @type {string[]} */ this.selectedHashes = [];
        /** @type {NodeJS.Timeout} */ this.selectionModeTimer = null;
        /** @type {import('../../data/music-sorting-properties.js').SortingProperties} */ this.sortingProperty = 'unset';
        /** @type {import('../../data/sorting-directions.js').Sortings} */ this.sortingDirection = 'ascending';

        this.currentPage = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        document.title = 'Musik';
        setFavicon(noteIcon());
        this.subcriptions.push(
            session.instruments.subscribe(() => {
                this.initializeData();
                this.requestUpdate(undefined);
            })
        );
        this.addEventListener('click', () => {
            if (!this.selectionMode) return;
            this.selectionMode = false;
            this.selectedHashes = [];
            this.requestUpdate(undefined);
        });
    }

    async initializeData() {
        this.loading = true;
        await this.requestUpdate(undefined);

        try {
            this.musicTracks = (await MusicService.getAll()).map((x) => new ExtendedMusicModel(x));
        } catch (err) {
            console.error(err);
        }
        var localSearchString = localStorage.getItem(`music.search`);
        if (localSearchString) this.filter = JSON.parse(localSearchString);

        localSearchString = localStorage.getItem(`music.sorting`);
        if (localSearchString) {
            var object = JSON.parse(localSearchString);
            this.sortingProperty = object.property;
            this.sortingDirection = object.direction;
        }

        this.loading = false;
        await this.requestUpdate(undefined);
    }

    render() {
        return renderMusicPage(this);
    }

    /**
     * @param {ExtendedMusicModel} track
     */
    getTrackIcon(track) {
        var trackSrc = `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(track.path)}`;
        if (this.currentTrackPath != trackSrc) return noteIcon();
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
     * @param {ExtendedMusicModel} track
     */
    async toggleMusic(track) {
        if (this.selectionMode || this.selectionModeUnset) return;
        var trackSrc = `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(track.path)}`;
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#current-track');
        if (this.currentTrackPath == trackSrc && !audioElement.paused) audioElement.pause();
        else if (this.currentTrackPath == trackSrc && audioElement.paused) audioElement.play();
        this.isPaused = audioElement.paused;
        this.requestUpdate(undefined);

        if (this.currentTrackPath == trackSrc) return;

        this.currentTrackPath = trackSrc;
        await this.requestUpdate(undefined);
        await audioElement.play();
        this.isPaused = audioElement.paused;
        this.requestUpdate(undefined);
    }

    async playPlaylist() {
        var guid = '';
        if (this.selectedHashes.length > 0) guid = await PlaylistService.createTemporaryPlaylist(this.selectedHashes);
        else guid = await PlaylistService.createTemporaryPlaylist(this.filteredTracks.map((x) => x.hash));
        changePage(Pages.musicPlaylist.routes[0], `?guid=${guid}&track=0`);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MusicPage.processFiles(fileImportResult.files, fileImportResult.basePath);
        } catch (err) {
            console.trace('the import of files was aborted', err);
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
                var track = ExtendedMusicModel.fromFile(files[i], basePath);
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

    updateSorting(sortingProperty, sortingDirection) {
        console.log(sortingProperty);
        this.sortingProperty = sortingProperty;
        this.sortingDirection = sortingDirection;
        localStorage.setItem(
            `music.sorting`,
            JSON.stringify({ property: this.sortingProperty, direction: this.sortingDirection })
        );
        this.requestUpdate(undefined);
    }

    async cleanupTracks() {
        var brokenTracks = (await CleanupService.getBrokenAudioTracks()).map((x) => new ExtendedMusicModel(x));

        if (brokenTracks.length <= 0)
            MessageDialog.show('Alles Ok!', 'Alle in Tracks in der Datenbank sind valide Audio-Dateien.');

        var dialog = SelectOptionsDialog.show(
            brokenTracks.reduce((prev, curr) => {
                prev[curr.hash] = curr.displayName;
                return prev;
            }, {})
        );

        dialog.addEventListener('decline', () => dialog.remove());
        dialog.addEventListener('accept', async (e) => {
            try {
                var selected = /** @type {CustomEvent<{selected: string[]}>} */ (e).detail.selected;
                var failedTracks = await CleanupService.cleanupMusic(selected);
                if (failedTracks && failedTracks.length > 0)
                    await MessageDialog.show(
                        'Warnung!',
                        `Die folgenden Tracks konnten nicht gelöscht werden:
                        ${failedTracks.map((hash) => brokenTracks.find((track) => track.hash == hash).displayName).join('\n')} 
                    `
                    );
                dialog.remove();
                location.reload();
            } catch (err) {
                console.error(err);
                MessageDialog.show('Bereinigung fehlgeschlagen', err);
            }
        });
    }

    /**
     * @param {string} audioHash
     */
    startSelectionModeTimer(audioHash) {
        if (this.selectionModeUnset) this.selectionModeUnset = false;
        if (this.selectionMode) return;
        this.selectionModeTimer = setTimeout(() => {
            this.selectionModeTimer = null;
            this.selectionMode = true;
            this.selectionModeSet = true;
            this.selectedHashes.push(audioHash);
            this.requestUpdate(undefined);
        }, 500);
        this.requestUpdate(undefined);
    }

    stopSelectionModeTimer(hash) {
        if (this.selectionMode && !this.selectionModeSet) this.toggleTrackSelection(null, hash);
        this.selectionModeSet = false;
        if (!this.selectionModeTimer) return;
        clearTimeout(this.selectionModeTimer);
        this.requestUpdate(undefined);
    }

    /**
     * @param {HTMLInputElement} input
     * @param {string} hash
     */
    toggleTrackSelection(input, hash) {
        if ((!input || input.checked) && !this.selectedHashes.includes(hash)) this.selectedHashes.push(hash);
        else if (!input || !input.checked) this.selectedHashes = this.selectedHashes.filter((x) => x != hash);
        if (this.selectedHashes.length == 0) {
            this.selectionMode = false;
            this.selectionModeUnset = true;
        }
        this.requestUpdate(undefined);
    }

    jumpToActive() {
        /** @type {PaginatedScrolling} */ var parent = this.shadowRoot.querySelector('paginated-scrolling');
        var child = this.shadowRoot.querySelector('audio-tile:not([paused])').parentElement;
        parent.scrollToChild(child.parentElement);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subcriptions.forEach((x) => x.unsubscribe());
    }
}
