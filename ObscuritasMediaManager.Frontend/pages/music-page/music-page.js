import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options.js';
import { PaginatedScrolling } from '../../advanced-components/paginated-scrolling/paginated-scrolling.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base.js';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.js';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog.js';
import { PlaylistSelectionDialog } from '../../dialogs/playlist-selection-dialog/playlist-selection-dialog.js';
import { SelectOptionsDialog } from '../../dialogs/select-options-dialog/select-options-dialog.js';
import { FallbackAudio } from '../../native-components/fallback-audio/fallback-audio.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import { MusicModel, PlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { noteIcon } from '../../resources/inline-icons/general/note-icon.svg.js';
import { pauseIcon } from '../../resources/inline-icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/inline-icons/music-player-icons/play-icon.svg.js';
import { CleanupService, MusicService, PlaylistService } from '../../services/backend.services.js';
import { sortBy } from '../../services/extensions/array.extensions.js';
import { playAudio } from '../../services/extensions/audio.extension.js';
import { importFiles } from '../../services/extensions/file.extension.js';
import { changePage, getPageName } from '../../services/extensions/url.extension.js';
import { MusicFilterService } from '../../services/music-filter.service.js';
import { MusicPlaylistPage } from '../music-playlist-page/music-playlist-page.js';
import { renderMusicPageStyles } from './music-page.css.js';
import { renderMusicPage } from './music-page.html.js';

export class MusicPage extends LitElementBase {
    static isPage = true;
    static pageName = 'Musik';
    static icon = noteIcon();

    static get styles() {
        return renderMusicPageStyles();
    }

    static get properties() {
        return {};
    }

    get paginatedPlaylists() {
        return this.filteredPlaylists.slice(0, 6 + 3 * this.currentPage);
    }

    get paginatedTracks() {
        var pageSize = 6 + 3 * this.currentPage - this.filteredPlaylists.length;
        if (pageSize < 0) pageSize = 0;
        return this.filteredTracks.slice(0, pageSize);
    }

    get filteredPlaylists() {
        var sorted = MusicFilterService.filterPlaylists(this.playlists, this.filter);
        if (this.sortingProperty != 'unset') sorted = sortBy(sorted, (x) => x[this.sortingProperty]);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    get filteredTracks() {
        var sorted = MusicFilterService.filterTracks(this.musicTracks, this.filter);
        if (this.sortingProperty != 'unset') sorted = sortBy(sorted, (x) => x[this.sortingProperty]);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    get currentTrackUrl() {
        return `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(this.currentTrack.path)}`;
    }

    /** @type {HTMLAudioElement} */
    get audioElement() {
        return this.fallbackElement?.audioElement ?? document.createElement('audio');
    }

    constructor() {
        super();

        /** @type {ExtendedMusicModel[]} */ this.musicTracks = [];
        /** @type {PlaylistModel[]} */ this.playlists = [];
        /** @type {ExtendedMusicModel} */ this.currentTrack = new ExtendedMusicModel();
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {MusicFilterOptions} */ this.filter = new MusicFilterOptions();
        /** @type {Subscription[]} */ this.subcriptions = [];
        /** @type {boolean} */ this.selectionMode = false;
        /** @type {string[]} */ this.selectedHashes = [];
        /** @type {NodeJS.Timeout} */ this.selectionModeTimer = null;
        /** @type {import('../../data/music-sorting-properties.js').SortingProperties} */ this.sortingProperty = 'unset';
        /** @type {import('../../data/sorting-directions.js').Sortings} */ this.sortingDirection = 'ascending';
        /** @type {FallbackAudio} */ this.fallbackElement;

        this.currentPage = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        this.subcriptions.push(
            session.instruments.subscribe(() => {
                this.initializeData();
                this.requestUpdate(undefined);
            }),
            session.currentPage.subscribe((nextPage) => {
                if (
                    !this.audioElement ||
                    this.audioElement.paused ||
                    this.audioElement.currentTime > 0 ||
                    nextPage == 'music' ||
                    nextPage == 'music-playlist'
                )
                    return;

                PlayMusicDialog.show(this.currentTrack, this.currentVolumne, this.audioElement?.currentTime ?? 0);
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
            this.playlists = await PlaylistService.listPlaylists();
            this.musicTracks = (await MusicService.getAll()).map((x) => new ExtendedMusicModel(x));
        } catch (err) {
            console.error(err);
        }
        var localSearchString = localStorage.getItem(`music.search`);
        if (localSearchString) this.filter = MusicFilterOptions.fromJSON(localSearchString);

        localSearchString = localStorage.getItem(`music.sorting`);
        if (localSearchString) {
            var object = JSON.parse(localSearchString);
            this.sortingProperty = object.property;
            this.sortingDirection = object.direction;
        }

        this.loading = false;
        await this.requestUpdate(undefined);
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.fallbackElement = this.shadowRoot.querySelector('fallback-audio');
    }

    render() {
        return renderMusicPage(this);
    }

    /**
     * @param {ExtendedMusicModel} track
     */
    getTrackIcon(track) {
        if (this.currentTrack?.path != track?.path) return noteIcon();
        if (this.audioElement.paused) return playIcon();
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
        PlayMusicDialog.stop();

        if (this.currentTrack.hash != track.hash) this.currentTrack = track;
        await this.requestUpdate(undefined);

        if (!this.audioElement.paused) this.audioElement.pause();
        else if (this.audioElement.paused) await playAudio(this.audioElement);
        await this.requestUpdate(undefined);
    }

    async playPlaylist() {
        var playlistId = '';
        if (this.selectedHashes.length > 0) playlistId = await PlaylistService.createTemporaryPlaylist(this.selectedHashes);
        else playlistId = await PlaylistService.createTemporaryPlaylist(this.filteredTracks.map((x) => x.hash));
        changePage(getPageName(MusicPlaylistPage), `?guid=${playlistId}&track=0`);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MusicPage.processFiles(fileImportResult.files, fileImportResult.basePath);
            DialogBase.show('Upload successful', {
                content: 'The requested folder was successfully uploaded',
                declineActionText: 'Ok',
            });
        } catch (err) {}
    }

    /**
     * @param {File[]} files
     * @param {string} basePath
     */
    static async processFiles(files, basePath) {
        try {
            var musicTracks = ExtendedMusicModel.createFromFiles(files, basePath);
            await MusicService.batchCreateMusicTracks(musicTracks);
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
            DialogBase.show('Alles Ok!', {
                content: 'Alle in Tracks in der Datenbank sind valide Audio-Dateien.',
                declineActionText: 'Ok',
            });

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
                    await DialogBase.show('Warnung!', {
                        content: `Die folgenden Tracks konnten nicht gelöscht werden:
                        ${failedTracks.map((hash) => brokenTracks.find((track) => track.hash == hash).displayName).join('\n')}
                    `,
                        declineActionText: 'Ok',
                    });
                dialog.remove();
                location.reload();
            } catch (err) {
                console.error(err);
                DialogBase.show('Bereinigung fehlgeschlagen', { content: err, declineActionText: 'Ok' });
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

    async showPlaylistSelectionDialog() {
        /** @type {PlaylistModel} */ var playlist = await PlaylistSelectionDialog.requestPlaylist();

        await PlaylistService.addTracksToPlaylist(playlist.id, this.selectedHashes);
        await this.initializeData();
    }

    async showCreatePlaylistDialog() {
        var dummyPlaylist = await PlaylistService.getDummyPlaylist();
        await EditPlaylistDialog.show(dummyPlaylist);
        await this.initializeData();
    }

    /**
     * @param {'local' | 'global'} mode
     * @param {MusicModel} track
     */
    getTrackPath(mode, track) {
        if (mode == 'local') return track.path;
        return `https://localhost/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(track.path)}`;
    }

    /**
     * @param {'local' | 'global'} mode
     * @param {PlaylistModel} playlist
     */
    async exportPlaylist(mode, playlist) {
        var m3uString = '#EXTM3U\r\n';
        m3uString += playlist.tracks
            .map((track) => `#EXTINF:-1, ${track.displayName.replaceAll('\n', '')}\r\n${this.getTrackPath(mode, track)}`)
            .join('\r\n');

        var blob = new Blob([m3uString], { type: 'audio/x-mpegurl' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = `${playlist.name}.m3u`;
        document.body.appendChild(link);
        link.click();
    }

    /**
     * @param {PlaylistModel} playlist
     */
    async removePlaylist(playlist) {
        var accpeted = await DialogBase.show('Bist du sicher?', {
            content: `Bist du sicher, dass du die Playlist löschen möchtest?\r\n
                Diese Aktion kann nicht rückgängig gemacht werden!`,
            acceptActionText: 'Ja',
            declineActionText: 'Nein',
            noImplicitAccept: true,
            showBorder: true,
        });

        if (!accpeted) return;

        try {
            await PlaylistService.deletePlaylist(playlist.id);
            MessageSnackbar.popup('Die Playlist wurde erfolgreich gelöscht', 'success');
            await this.initializeData();
        } catch (err) {
            MessageSnackbar.popup(`Ein Fehler ist beim Löschen der Playlist aufgetreten: \r\n ${err}`, 'error');
        }
    }
}
