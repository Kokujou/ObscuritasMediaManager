import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options.js';
import { PaginatedScrolling } from '../../advanced-components/paginated-scrolling/paginated-scrolling.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { Session } from '../../data/session.js';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base.js';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.js';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog.js';
import { PlaylistSelectionDialog } from '../../dialogs/playlist-selection-dialog/playlist-selection-dialog.js';
import { ContextMenu } from '../../native-components/context-menu/context-menu.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import { MusicModel, PlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { noteIcon } from '../../resources/inline-icons/general/note-icon.svg.js';
import { AudioService } from '../../services/audio-service.js';
import { MusicService, PlaylistService } from '../../services/backend.services.js';
import { sortBy } from '../../services/extensions/array.extensions.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { MaintenanceService } from '../../services/maintenance.service.js';
import { MediaImportService } from '../../services/media-import.service.js';
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
        return {
            deletionMode: { type: Boolean, reflect: true },
        };
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
        var sorted = MusicFilterService.filterTracks(Session.tracks.current(), this.filter);
        if (this.sortingProperty != 'unset') sorted = sortBy(sorted, (x) => x[this.sortingProperty]);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    constructor() {
        super();

        /** @type {PlaylistModel[]} */ this.playlists = [];
        /** @type {MusicModel} */ this.currentTrack = new MusicModel();
        /** @type {MusicFilterOptions} */ this.filter = new MusicFilterOptions();
        /** @type {Subscription[]} */ this.subcriptions = [];
        /** @type {boolean} */ this.selectionMode = false;
        /** @type {string[]} */ this.selectedHashes = [];
        /** @type {NodeJS.Timeout} */ this.selectionModeTimer = null;
        /** @type {import('../../data/music-sorting-properties.js').SortingProperties} */ this.sortingProperty = 'unset';
        /** @type {import('../../data/sorting-directions.js').Sortings} */ this.sortingDirection = 'ascending';

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));

        this.currentPage = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume));
        this.initializeData();
        this.subcriptions.push(
            Session.instruments.subscribe(() => {
                this.initializeData();
                this.requestFullUpdate();
            }),
            Session.currentPage.subscribe((nextPage) => {
                if (
                    !AudioService ||
                    AudioService.paused ||
                    AudioService.trackPosition.current() <= 0 ||
                    nextPage == 'music' ||
                    nextPage == 'music-playlist'
                )
                    return;

                PlayMusicDialog.show(this.currentTrack, AudioService.volume, AudioService.trackPosition.current());
            })
        );

        this.addEventListener('click', () => {
            if (!this.selectionMode || ContextMenu.instance) return;
            this.selectionMode = false;
            this.selectedHashes = [];
            this.requestFullUpdate();
        });
    }

    async initializeData() {
        this.loading = true;
        await this.requestFullUpdate();

        try {
            this.playlists = await PlaylistService.listPlaylists();
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
        await this.requestFullUpdate();
    }

    render() {
        document.title = 'Musik';
        if (this.currentTrack?.path && !AudioService.paused) document.title += ` - ${this.currentTrack.displayName}`;
        return renderMusicPage(this);
    }

    loadNext() {
        this.currentPage++;
        this.requestFullUpdate();
    }

    async changeVolume(newVolume) {
        await AudioService.changeVolume(newVolume / 100);
        localStorage.setItem('volume', newVolume.toString());
        await this.requestFullUpdate();
    }

    /**
     * @param {MusicModel} track
     */
    async toggleMusic(track) {
        if (this.selectionMode || this.selectionModeUnset) return;
        await PlayMusicDialog.instance?.close();

        if (this.currentTrack.hash != track.hash) {
            this.currentTrack = track;
            await AudioService.changeTrack(track?.path);
            await AudioService.play();
            await this.requestFullUpdate();
            return;
        }

        if (!AudioService.paused) await AudioService.pause();
        else if (AudioService.paused) await AudioService.play();
        await this.requestFullUpdate();
    }

    async playPlaylist() {
        var playlistId = '';
        if (this.selectedHashes.length > 0) playlistId = await PlaylistService.createTemporaryPlaylist(this.selectedHashes);
        else playlistId = await PlaylistService.createTemporaryPlaylist(this.filteredTracks.map((x) => x.hash));
        changePage(MusicPlaylistPage, { playlistId: playlistId });
    }

    async importFolder() {
        await MediaImportService.importAudioFiles();
    }

    /**
     * @param {MusicFilterOptions} filter
     */
    updateFilter(filter) {
        this.filter = filter;
        localStorage.setItem(`music.search`, JSON.stringify(this.filter));
        this.requestFullUpdate();
    }

    updateSorting(sortingProperty, sortingDirection) {
        this.sortingProperty = sortingProperty;
        this.sortingDirection = sortingDirection;
        localStorage.setItem(
            `music.sorting`,
            JSON.stringify({ property: this.sortingProperty, direction: this.sortingDirection })
        );
        this.requestFullUpdate();
    }

    async cleanupTracks() {
        var success = await MaintenanceService.cleanAudioTracks();
        if (success) await this.initializeData();
    }

    /**
     * @param {string} audioHash
     * @param {PointerEvent} event
     */
    startSelectionModeTimer(audioHash, event) {
        if (event.button != 0) return;
        if (this.selectionModeUnset) this.selectionModeUnset = false;
        if (this.selectionMode) return;
        this.selectionModeTimer = setTimeout(() => {
            this.selectionModeTimer = null;
            this.selectionMode = true;
            this.selectionModeSet = true;
            this.selectedHashes.push(audioHash);
            this.requestFullUpdate();
        }, 500);
        this.requestFullUpdate();
    }

    /**
     * @param {string} hash
     * @param {PointerEvent} event
     */
    stopSelectionModeTimer(hash, event) {
        if (event.button != 0) return;
        if (this.selectionMode && !this.selectionModeSet) this.toggleTrackSelection(null, hash);
        this.selectionModeSet = false;
        if (!this.selectionModeTimer) return;
        clearTimeout(this.selectionModeTimer);
        this.requestFullUpdate();
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
        this.requestFullUpdate();
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
        return `https://${location.hostname}/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(track.path)}`;
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

    /**
     * @param {MusicModel} track
     */
    async softDeleteTrack(track) {
        var trackHashes = [track.hash];
        if (this.selectionMode && this.selectedHashes.includes(track.hash)) {
            trackHashes = this.selectedHashes;
            var accepted = await DialogBase.show('Bist du sicher?', {
                content: 'Sie sind dabei mehrere Tracks zu löschen.\r\n Sind Sie sicher?',
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
            });
            if (!accepted) return;
        }

        try {
            await MusicService.softDeleteTracks(trackHashes);
            await this.initializeData();
            MessageSnackbar.popup('Tracks erfolgreich gelöscht.', 'success');
        } catch (err) {
            MessageSnackbar.popup(`Ein Fehler ist beim Löschen aufgetreten: \r\n ${err}.`, 'error');
        }
    }

    async hardDeleteTrack(track) {
        var trackHashes = [track.hash];
        if (this.selectionMode && this.selectedHashes.includes(track.hash)) {
            trackHashes = this.selectedHashes;
            var accepted = await DialogBase.show('Vorsicht!', {
                content:
                    'Sie sind dabei mehrere Tracks permanent zu löschen.\r\n' +
                    'Diese Aktion kann nicht rückgängig gemacht werden!\r\n' +
                    'Sind Sie sicher?',
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
            });
            if (!accepted) return;
        } else {
            var accepted = await DialogBase.show('Vorsicht!', {
                content:
                    'Sie sind dabei einen Track permanent zu löschen.\r\n' +
                    'Diese Aktion kann nicht rückgängig gemacht werden!\r\n' +
                    'Sind Sie sicher?',
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
            });
            if (!accepted) return;
        }

        try {
            await MusicService.hardDeleteTracks(trackHashes);
            await this.initializeData();
            MessageSnackbar.popup('Tracks erfolgreich permanent gelöscht.', 'success');
        } catch (err) {
            MessageSnackbar.popup(`Ein Fehler ist beim permanenten Löschen aufgetreten: \r\n ${err}.`, 'error');
        }
    }

    /**
     * @param {MusicModel} track
     */
    async undeleteTrack(track) {
        var trackHashes = [track.hash];
        if (this.selectionMode && this.selectedHashes.includes(track.hash)) trackHashes = this.selectedHashes;

        try {
            await MusicService.undeleteTracks(trackHashes);
            await this.initializeData();
            MessageSnackbar.popup('Die Track(s) wurden erfolgreich wiederhergestellt', 'success');
        } catch (err) {
            MessageSnackbar.popup('Ein Fehler ist beim wiederherstellen der Track(s) aufgetreten: \r\n' + err, 'error');
        }
    }

    async disconnectedCallback() {
        await AudioService.reset();
        await super.disconnectedCallback();
    }
}
