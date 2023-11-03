import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher.js';
import { FilesQueryRequest } from '../../client-interop/files-query-request.js';
import { InteropQuery } from '../../client-interop/interop-query.js';
import { Session } from '../../data/session.js';
import { LyricsDialog } from '../../dialogs/audio-subtitle-dialog/lyrics-dialog.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    MusicGenre,
    MusicModel,
    PlaylistModel,
    UpdateRequestOfJsonElement,
} from '../../obscuritas-media-manager-backend-client.js';
import { noteIcon } from '../../resources/inline-icons/general/note-icon.svg.js';
import { AudioService } from '../../services/audio-service.js';
import { MusicService, PlaylistService } from '../../services/backend.services.js';
import { ClientInteropService } from '../../services/client-interop-service.js';
import { distinct, randomizeArray } from '../../services/extensions/array.extensions.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { AudioFileExtensions } from './audio-file-extensions.js';
import { renderMusicPlaylistStyles } from './music-playlist-page.css.js';
import { MusicPlaylistPageTemplate } from './music-playlist-page.html.js';

export class MusicPlaylistPage extends MusicPlaylistPageTemplate {
    static pageName = 'music-playlist-page';
    static isPage = true;
    static icon = noteIcon();

    static get styles() {
        return renderMusicPlaylistStyles();
    }

    static get properties() {
        return {
            hoveredRating: { type: Number, reflect: false },
            moodToSwitch: { type: String, reflect: false },
        };
    }

    get autocompleteGenres() {
        return Object.values(MusicGenre).filter((genre) => !this.updatedTrack.genres?.some((x) => MusicGenre[x] == genre));
    }

    get audioSource() {
        if (!this.currentTrack?.path) return;
        return `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(this.currentTrack?.path)}`;
    }

    get currentTrackPosition() {
        return AudioService.trackPosition.current();
    }

    get currentTrackDuration() {
        return AudioService.duration ?? 0;
    }

    get currentTrackPositionText() {
        var position = this.currentTrackPosition / 1000;
        var minutes = Math.floor(position / 60);
        var seconds = Math.floor(position - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    get currentTrackDurationText() {
        var duration = this.currentTrackDuration / 1000;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    constructor() {
        super();
        /** @type {string} */ this.playlistId = null;
        /** @type {string} */ this.trackHash = null;
        /** @type {number} */ this.trackIndex = 0;
        /** @type {boolean} */ this.createNew = false;
    }

    connectedCallback() {
        super.connectedCallback();
        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume));

        this.subscriptions.push(
            Session.currentPage.subscribe((nextPage) => {
                PlayMusicDialog.show(this.currentTrack, this.currentVolume, AudioService.trackPosition.current());
            }),
            AudioService.ended.subscribe(() => {
                if (this.trackIndex + 1 >= this.playlist.tracks.length && !this.loop) return;
                this.changeTrackBy(1);
            }, true)
        );

        window.addEventListener('hashchange', (e) => {
            PlayMusicDialog.show(this.currentTrack, this.currentVolume, AudioService.trackPosition.current() ?? 0);
        });

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));
        this.initializeData();
    }

    async initializeData() {
        if (this.createNew) {
            this.playlist = new PlaylistModel({
                tracks: [await MusicService.getDefault()],
                isTemporary: true,
                genres: [],
            });
        } else if (!this.playlistId) {
            var currentTrack = await MusicService.get(this.trackHash);
            this.playlist = new PlaylistModel({ tracks: [new MusicModel(currentTrack)], isTemporary: true, genres: [] });
            this.trackIndex = 0;
        } else {
            this.playlist = await PlaylistService.getPlaylist(this.playlistId);
            this.playlist.tracks = this.playlist.tracks.map((x) => new MusicModel(x));
            this.trackIndex = this.trackIndex;
        }

        this.currentTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);
        AudioService.changeTrack(this.currentTrack);
        await this.requestFullUpdate();
    }

    render() {
        if (this.createNew) document.title = 'Neuer Track' + (this.updatedTrack.name ? ` - ${this.updatedTrack.name}` : '');
        else if (this.playlist?.isTemporary || !this.playlist?.name) document.title = this.updatedTrack.displayName;
        else document.title = this.playlist.name + ' - ' + this.updatedTrack.name;
        return super.render();
    }

    async toggleCurrentTrack() {
        if (!this.updatedTrack.path) return await MessageSnackbar.popup('Kein Pfad ausgewählt', 'error');
        try {
            if (AudioService.paused) await AudioService.play();
            else await AudioService.pause();
        } catch {
            await this.changeTrackBy(1);
        }

        this.requestFullUpdate();
    }

    /**
     * @param {number} offset
     */
    async changeTrackBy(offset) {
        var index = this.trackIndex + offset;
        if (index < 0) index = this.playlist.tracks.length - 1;
        if (index >= this.playlist.tracks.length) index = 0;
        await this.changeTrack(index);
    }

    /**
     *
     * @param {number} index
     * @returns
     */
    async changeTrack(index) {
        console.trace('test');
        if (this.playlist.tracks.length == 1) return;
        this.trackIndex = index;
        this.currentTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);

        changePage(MusicPlaylistPage, { playlistId: this.playlist.id, trackIndex: this.trackIndex }, false);

        await this.requestFullUpdate();
        await AudioService.changeTrack(this.currentTrack);
        await AudioService.play();
    }

    /**
     * @param { number} newVolume
     */
    async changeVolume(newVolume) {
        this.currentVolume = newVolume / 100;
        await AudioService.changeVolume(this.currentVolume);
        localStorage.setItem('volume', newVolume.toString());
        await this.requestFullUpdate();
    }

    /**
     * @template {keyof MusicModel} T
     * @param {T} property
     * @param {MusicModel[T]} value
     */
    async changeProperty(property, value) {
        if (this.updatedTrack.hash) {
            /** @type {any} */ const { oldModel, newModel } = { oldModel: {}, newModel: {} };
            oldModel[property] = this.updatedTrack[property];
            newModel[property] = value;
            await MusicService.update(this.updatedTrack.hash, new UpdateRequestOfJsonElement({ oldModel, newModel }));
        }
        this.updatedTrack[property] = value;
        if (property == 'instruments') {
            this.updatedTrack.instrumentNames = this.updatedTrack.instruments.map((x) => x.name);
            this.updatedTrack.instrumentTypes = distinct(this.updatedTrack.instruments.map((x) => x.type));
        }
        await this.requestFullUpdate();
    }

    async showLanguageSwitcher() {
        var parent = this.shadowRoot.querySelector('#music-player-container');
        var result = await LanguageSwitcher.spawnAt(parent, this.updatedTrack.language, this.updatedTrack.nation);
        if (!result) return;
        this.changeProperty('language', result.language);
        this.changeProperty('nation', result.nation);
    }

    changeTrackPosition(value) {
        if (AudioService.duration == Infinity) return;
        AudioService.changePosition(Number.parseInt(value));
    }

    /**
     * @param {MusicGenre} genre
     */
    addGenre(genre) {
        if (!genre || !Object.values(MusicGenre).includes(genre)) return;
        var newGenres = this.updatedTrack.genres.concat([genre]);
        this.changeProperty('genres', newGenres);
    }

    removeGenreKey(key) {
        var newGenres = this.updatedTrack.genres.filter((x) => x != key);
        this.changeProperty('genres', newGenres);
    }

    async openInstrumentsDialog() {
        var genreDialog = await GenreDialog.startShowingWithInstruments(this.updatedTrack.instruments);
        genreDialog.addEventListener('accept', (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            var instruments = e.detail.acceptedGenres.map((x) => x.name);
            this.changeProperty(
                'instruments',
                Session.instruments.current().filter((i) => instruments.includes(i.name))
            );
            genreDialog.remove();
        });
    }

    async openEditPlaylistDialog() {
        await EditPlaylistDialog.show(this.playlist);
        await this.initializeData();
    }

    async toggleComplete() {
        /** @type {HTMLInputElement}*/ var input = this.shadowRoot.querySelector('#complete-check');
        await this.changeProperty('complete', input.checked);
    }

    async changeCurrentTrackPath() {
        var extensions = { 'Audio-Files': AudioFileExtensions };
        /** @type {string[]} */ var filePaths = await ClientInteropService.executeQuery({
            query: InteropQuery.RequestFiles,
            payload: /** @type {FilesQueryRequest} */ ({ multiselect: false, nameExtensionMap: extensions }),
        });
        if (!filePaths || filePaths.length != 1) return;

        this.updatedTrack.path = filePaths[0];
        this.requestFullUpdate();
        AudioService.changeTrack(this.updatedTrack);
    }

    randomize() {
        this.playlist.tracks = randomizeArray(this.playlist.tracks);
        this.trackIndex = 0;
        this.requestFullUpdate();
    }

    async showLyrics() {
        try {
            var dialog = await LyricsDialog.startShowing(this.currentTrack, AudioService, true);
            dialog.addEventListener('playlist-saved', async () => await this.changeProperty('lyrics', dialog.lyrics));
        } catch {
            MessageSnackbar.popup('Es konnten leider keine passenden Lyrics gefunden werden.', 'error');
        }
    }

    async createTrack() {
        var trackHash = await MusicService.createMusicTrack(this.updatedTrack);
        changePage(MusicPlaylistPage, { trackHash });
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await AudioService.reset();
    }
}
