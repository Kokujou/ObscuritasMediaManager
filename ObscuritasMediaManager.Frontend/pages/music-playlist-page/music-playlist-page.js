import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher.js';
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { session } from '../../data/session.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { InputDialog } from '../../dialogs/input-dialog/input-dialog.js';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog.js';
import { FallbackAudio } from '../../native-components/fallback-audio/fallback-audio.js';
import {
    GenreModel,
    InstrumentType,
    MusicGenre,
    PlaylistModel,
    UpdateRequestOfMusicModel,
} from '../../obscuritas-media-manager-backend-client.js';
import { noteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { MusicService, PlaylistService } from '../../services/backend.services.js';
import { randomizeArray } from '../../services/extensions/array.extensions.js';
import { openFileDialog } from '../../services/extensions/document.extensions.js';
import { changePage, getQueryValue } from '../../services/extensions/url.extension.js';
import { renderMusicPlaylistStyles } from './music-playlist-page.css.js';
import { renderMusicPlaylist } from './music-playlist-page.html.js';

export class MusicPlaylistPage extends LitElementBase {
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
        return Object.values(MusicGenre).filter((genre) => !this.updatedTrack.genres.some((x) => MusicGenre[x] == genre));
    }

    get audioSource() {
        return `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(this.currentTrack?.path)}`;
    }

    get currentTrackPosition() {
        if (!this.audioElement.currentTime) return 0;
        return this.audioElement.currentTime;
    }

    get currentTrackDuration() {
        if (!this.audioElement.duration) return 100;
        return Math.floor(this.audioElement.duration);
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

    get audioElement() {
        return this.fallbackAudio?.audioElement || document.createElement('audio');
    }

    constructor() {
        super();
        /** @type {PlaylistModel} */ this.playlist = new PlaylistModel({ tracks: [] });
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {ExtendedMusicModel} */ this.currentTrack = new ExtendedMusicModel();
        /** @type {ExtendedMusicModel} */ this.updatedTrack = new ExtendedMusicModel();
        /** @type {number} */ this.currentVolumne = 0.1;
        /** @type {number} */ this.maxPlaylistItems = 20;
        /** @type {number} */ this.hoveredRating = 0;
        /** @type {keyof ExtendedMusicModel & ('mood1' | 'mood2')} */ this.moodToSwitch = 'mood1';
        /** @type {FallbackAudio} */ this.fallbackAudio;

        this.initializeData();
    }

    connectedCallback() {
        super.connectedCallback();
        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume));

        document.onvisibilitychange = async () => {
            await this.updateTrack();
        };

        this.subscriptions.push(
            session.currentPage.subscribe((nextPage) => {
                if (
                    this.audioElement.paused ||
                    this.audioElement.currentTime <= 0 ||
                    nextPage == 'music' ||
                    nextPage == 'music-playlist'
                )
                    return;

                PlayMusicDialog.show(this.currentTrack, this.currentVolumne, this.audioElement?.currentTime ?? 0);
            })
        );

        window.addEventListener('hashchange', (e) => {
            if (
                this.audioElement.paused ||
                this.audioElement.currentTime <= 0 ||
                location.hash == 'music' ||
                location.hash == 'music-playlist'
            )
                return;

            PlayMusicDialog.show(this.currentTrack, this.currentVolumne, this.audioElement?.currentTime ?? 0);
        });
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        /** @type {FallbackAudio} */ var fallbackAudio = this.shadowRoot.querySelector('fallback-audio');
        this.fallbackAudio = fallbackAudio;
        this.requestUpdate(undefined);
    }

    async initializeData() {
        var playlistId = getQueryValue('guid');
        var trackId = getQueryValue('track');

        if (!playlistId) {
            var currentTrack = await MusicService.get(trackId);
            this.playlist = new PlaylistModel({ tracks: [new ExtendedMusicModel(currentTrack)], isTemporary: true, genres: [] });
            this.currentTrackIndex = 0;
        } else {
            this.playlist = await PlaylistService.getPlaylist(playlistId);
            this.playlist.tracks = this.playlist.tracks.map((x) => new ExtendedMusicModel(x));
            this.currentTrackIndex = Number.parseInt(trackId ?? '0');
        }

        this.currentTrack = Object.assign(new ExtendedMusicModel(), this.playlist.tracks[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new ExtendedMusicModel(), this.playlist.tracks[this.currentTrackIndex]);
        await this.requestUpdate(undefined);

        this.audioElement.addEventListener('error', (e) => {
            if (!this.audioElement.error?.code) return;
            console.error(`an error occured while playing the audio file: code ${this.audioElement.error.code}`);
        });
    }

    render() {
        if (this.playlist?.isTemporary || !this.playlist?.name) document.title = this.currentTrack.displayName;
        else document.title = this.playlist.name + ' - ' + this.currentTrack.name;
        if (this.currentTrackIndex) document.title = this.currentTrack.displayName;
        return renderMusicPlaylist(this);
    }

    async toggleCurrentTrack() {
        try {
            if (this.audioElement.paused) await this.audioElement.play();
            else this.audioElement.pause();
        } catch {
            await this.changeTrackBy(1);
        }

        this.requestUpdate(undefined);
    }

    async updateTrack() {
        if (JSON.stringify(this.currentTrack) == JSON.stringify(this.updatedTrack)) return;

        await MusicService.update(
            this.currentTrack.hash,
            new UpdateRequestOfMusicModel({ newModel: this.updatedTrack, oldModel: this.currentTrack })
        );
        Object.assign(this.currentTrack, this.updatedTrack);
        this.playlist.tracks[this.currentTrackIndex] = this.updatedTrack;
    }

    async changeTrackBy(offset) {
        var index = this.currentTrackIndex + offset;
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
        await this.updateTrack();
        if (this.playlist.tracks.length == 1) return;
        this.audioElement.pause();
        this.currentTrackIndex = index;
        this.currentTrack = Object.assign(new ExtendedMusicModel(), this.playlist.tracks[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new ExtendedMusicModel(), this.playlist.tracks[this.currentTrackIndex]);

        changePage(session.currentPage.current(), `?guid=${this.id}&track=${this.currentTrackIndex}`, false);

        await this.requestUpdate(undefined);
        this.audioElement.play();
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

        await this.requestUpdate(undefined);
    }

    async showLanguageSwitcher() {
        var parent = this.shadowRoot.querySelector('#music-player-container');
        var result = await LanguageSwitcher.spawnAt(parent, this.updatedTrack.language, this.updatedTrack.nation);
        if (!result) return;
        this.changeProperty('language', result.language);
        this.changeProperty('nation', result.nation);
    }

    async disconnectedCallback() {
        super.disconnectedCallback();
        await this.updateTrack();
    }

    changeTrackPosition(value) {
        if (this.audioElement.duration == Infinity) return;
        this.audioElement.currentTime = value;
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

    openInstrumentsDialog() {
        var instruments = session.instruments
            .current()
            .map((item, index) => new GenreModel({ id: `${index}`, name: item.name, section: item.type }));
        var allowedInstruments = this.updatedTrack.mappedInstruments.map(
            (instrument, index) => new GenreModel({ id: `${index}`, name: instrument.name, section: instrument.type })
        );
        var genreDialog = GenreDialog.show({
            genres: instruments,
            allowedGenres: allowedInstruments,
            ignoredState: CheckboxState.Forbid,
            allowAdd: true,
            allowRemove: true,
        });
        genreDialog.addEventListener('accept', (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            var instruments = e.detail.acceptedGenres.map((x) => x.name);
            this.requestUpdate(undefined);
            this.changeProperty('instruments', instruments);
            genreDialog.remove();
        });
        genreDialog.addEventListener('decline', () => {
            genreDialog.remove();
        });
        genreDialog.addEventListener(
            'add-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                await MusicService.addInstrument(/** @type {InstrumentType} */ (e.detail.section), e.detail.name);
                genreDialog.options.genres.push(
                    new GenreModel({ id: e.detail.name, name: e.detail.name, section: e.detail.section })
                );
                session.instruments.next(await MusicService.getInstruments());

                genreDialog.requestUpdate(undefined);
            }
        );
        genreDialog.addEventListener(
            'remove-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                await MusicService.removeInstrument(/** @type {InstrumentType} */ (e.detail.section), e.detail.name);
                genreDialog.options.genres = genreDialog.options.genres.filter((x) => x.name != e.detail.name);
                session.instruments.next(await MusicService.getInstruments());
                genreDialog.requestUpdate(undefined);
            }
        );
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
        var files = await openFileDialog();
        if (!files || files.length <= 0 || !files[0].name) return;
        var basePath = await InputDialog.show('Bitte den Basispfad des ausgewählten Ordners eingeben:');
        if (!basePath) return;

        if (!basePath.endsWith('\\')) basePath += '\\';
        this.updatedTrack.path = basePath + files[0].name;
        this.requestUpdate(undefined);
    }

    randomize() {
        var currentItem = this.playlist.tracks[this.currentTrackIndex];
        this.playlist.tracks = randomizeArray(this.playlist.tracks);
        this.currentTrackIndex = this.playlist.tracks.indexOf(currentItem);

        this.requestUpdate(undefined);
    }
}
