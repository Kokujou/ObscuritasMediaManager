import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher.js';
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { session } from '../../data/session.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { LitElement } from '../../exports.js';
import { GenreModel, MusicGenre, UpdateRequestOfMusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { noteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { MusicService, PlaylistService } from '../../services/backend.services.js';
import { randomizeArray } from '../../services/extensions/array.extensions.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { changePage, getQueryValue } from '../../services/extensions/url.extension.js';
import { renderMusicPlaylistStyles } from './music-playlist-page.css.js';
import { renderMusicPlaylist } from './music-playlist-page.html.js';

export class MusicPlaylistPage extends LitElement {
    static get styles() {
        return renderMusicPlaylistStyles();
    }

    static get properties() {
        return {
            hoveredRating: { type: Number, reflect: false },
        };
    }

    get autocompleteGenres() {
        return Object.values(MusicGenre).filter((genre) => !this.updatedTrack.genres.some((x) => MusicGenre[x] == genre));
    }

    get paused() {
        var audioElement = this.shadowRoot.querySelector('audio');
        return audioElement?.paused;
    }

    get audioSource() {
        if (this.currentTrack && this.currentTrack.path)
            return `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(this.currentTrack.path)}`;
        return '';
    }

    get currentTrackPosition() {
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');
        if (!audioElement || !audioElement.currentTime) return 0;
        return audioElement.currentTime;
    }

    get currentTrackDuration() {
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');
        if (!audioElement || !audioElement.duration) return 100;
        return Math.floor(audioElement.duration);
    }

    get currentTrackPositionText() {
        var position = this.currentTrackPosition;
        var minutes = Math.floor(position / 60);
        var seconds = Math.floor(position - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    get currentTrackDurationText() {
        var duration = this.currentTrackDuration;
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration - minutes * 60);

        return `${Math.floor(minutes).toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    constructor() {
        super();
        /** @type {ExtendedMusicModel[]} */ this.playlist = [];
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {ExtendedMusicModel} */ this.currentTrack = new ExtendedMusicModel();
        /** @type {ExtendedMusicModel} */ this.updatedTrack = new ExtendedMusicModel();
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {number} */ this.maxPlaylistItems = 20;
        /** @type {number} */ this.hoveredRating = 0;

        this.initializeData();
    }
    connectedCallback() {
        super.connectedCallback();
        setFavicon(noteIcon());
        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume));

        document.onvisibilitychange = async () => {
            await this.updateTrack();
        };
    }

    async initializeData() {
        var playlistId = getQueryValue('guid');
        var trackId = getQueryValue('track');

        if (!playlistId) {
            var currentTrack = await MusicService.get(trackId);
            this.playlist = [new ExtendedMusicModel(currentTrack)];
            this.currentTrackIndex = 0;
        } else {
            this.id = playlistId;
            this.playlist = (await PlaylistService.getTemporaryPlaylist(playlistId)).map((x) => new ExtendedMusicModel(x));
            this.currentTrackIndex = Number.parseInt(trackId);
        }

        this.currentTrack = Object.assign(new ExtendedMusicModel(), this.playlist[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new ExtendedMusicModel(), this.playlist[this.currentTrackIndex]);
        await this.requestUpdate(undefined);

        var audio = this.shadowRoot.querySelector('audio');
        audio.addEventListener('error', function (e) {
            alert(`an error occured while playing the audio file: code ${audio.error.code}`);
        });
    }

    render() {
        document.title = this.currentTrack.displayName;
        if (this.currentTrackIndex) document.title = this.currentTrack.displayName;
        return renderMusicPlaylist(this);
    }

    toggleCurrentTrack() {
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');

        if (audioElement.paused) audioElement.play();
        else audioElement.pause();

        this.requestUpdate(undefined);
    }

    async updateTrack() {
        if (JSON.stringify(this.currentTrack) == JSON.stringify(this.updatedTrack)) return;

        await MusicService.update(
            this.currentTrack.hash,
            new UpdateRequestOfMusicModel({ newModel: this.updatedTrack, oldModel: this.currentTrack })
        );
        Object.assign(this.currentTrack, this.updatedTrack);
        this.playlist[this.currentTrackIndex] = this.updatedTrack;
    }

    async changeTrackBy(offset) {
        var index = this.currentTrackIndex + offset;
        if (index < 0) index = this.playlist.length - 1;
        if (index >= this.playlist.length) index = 0;
        await this.changeTrack(index);
    }

    async changeTrack(index) {
        await this.updateTrack();
        if (this.playlist.length == 1) return;
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');
        audioElement.pause();
        this.currentTrackIndex = index;
        this.currentTrack = Object.assign(new ExtendedMusicModel(), this.playlist[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new ExtendedMusicModel(), this.playlist[this.currentTrackIndex]);

        changePage(session.currentPage.current(), `?guid=${this.id}&track=${this.currentTrackIndex}`, false);

        await this.requestUpdate(undefined);
        audioElement.play();
    }

    /**
     * @param { number} newVolume
     */
    changeVolume(newVolume) {
        this.currentVolumne = newVolume / 100;
        localStorage.setItem('volume', newVolume.toString());
        this.requestUpdate(undefined);
    }

    /**
     * @param {keyof  ExtendedMusicModel} property
     * @param {any} value
     */
    async changeProperty(property, value) {
        if (property == 'displayName' || property == 'mappedInstruments' || property == 'instrumentTypes') return;
        if (property == 'rating') this.updatedTrack[property] = value;
        else if (property == 'complete') this.updatedTrack[property] = value;
        else {
            /** @type {any} */ (this.updatedTrack[property]) = value;
        }

        this.requestUpdate(undefined);
    }

    async showLanguageSwitcher() {
        var parent = this.shadowRoot.querySelector('#music-player-container');
        var language = await LanguageSwitcher.spawnAt(parent, this.currentTrack.language);
        this.changeProperty('language', language);
    }

    async showNationSwitcher() {
        var parent = this.shadowRoot.querySelector('#music-player-container');
        var nation = await LanguageSwitcher.spawnAt(parent, this.currentTrack.nation);
        this.changeProperty('nation', nation);
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
        await this.updateTrack();
    }

    changeTrackPosition(value) {
        /** @type {HTMLAudioElement} */ var audioElement = this.shadowRoot.querySelector('#audio-player');
        if (audioElement.duration == Infinity) return;
        audioElement.currentTime = value;
    }

    /**
     * @param {MusicGenre} genre
     */
    addGenre(genre) {
        var newGenres = this.updatedTrack.genres.concat([genre]);
        this.changeProperty('genres', newGenres);
    }

    removeGenreKey(key) {
        var newGenres = this.updatedTrack.genres.filter((x) => x != key);
        this.changeProperty('genres', newGenres);
    }

    openInstrumentsDialog() {
        var instruments = session.instruments
            .current()
            .map((item, index) => new GenreModel({ id: `${index}`, name: item.name, section: item.type }));
        var allowedInstruments = this.updatedTrack.mappedInstruments.map(
            (instrument, index) => new GenreModel({ id: `${index}`, name: instrument.name, section: instrument.type })
        );
        var genreDialog = GenreDialog.show(instruments, allowedInstruments, [], false, CheckboxState.Forbid);
        genreDialog.addEventListener('accept', (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            var instruments = e.detail.acceptedGenres.map((x) => x.name);
            this.requestUpdate(undefined);
            this.changeProperty('instruments', instruments);
            genreDialog.remove();
        });
        genreDialog.addEventListener('decline', () => {
            genreDialog.remove();
        });
    }

    async toggleComplete() {
        /** @type {HTMLInputElement}*/ var input = this.shadowRoot.querySelector('#complete-check');
        await this.changeProperty('complete', input.checked);
    }

    randomize() {
        var currentItem = this.playlist[this.currentTrackIndex];
        this.playlist = randomizeArray(this.playlist);
        this.currentTrackIndex = this.playlist.indexOf(currentItem);

        this.requestUpdate(undefined);
    }
}
