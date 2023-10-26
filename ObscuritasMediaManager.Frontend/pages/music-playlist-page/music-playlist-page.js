import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher.js';
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { LyricsDialog } from '../../dialogs/audio-subtitle-dialog/lyrics-dialog.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { InputDialog } from '../../dialogs/input-dialog/input-dialog.js';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    GenreModel,
    InstrumentType,
    MusicGenre,
    MusicModel,
    PlaylistModel,
    UpdateRequestOfMusicModel,
} from '../../obscuritas-media-manager-backend-client.js';
import { noteIcon } from '../../resources/inline-icons/general/note-icon.svg.js';
import { AudioService } from '../../services/audio-service.js';
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
        return AudioService.duration;
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
        /** @type {PlaylistModel} */ this.playlist = new PlaylistModel({ tracks: [] });
        /** @type {number} */ this.currentTrackIndex = 0;
        /** @type {MusicModel} */ this.currentTrack = new MusicModel();
        /** @type {MusicModel} */ this.updatedTrack = new MusicModel();
        /** @type {number} */ this.currentVolume = 0.1;
        /** @type {number} */ this.maxPlaylistItems = 20;
        /** @type {number} */ this.hoveredRating = 0;
        /** @type {keyof MusicModel & ('mood1' | 'mood2')} */ this.moodToSwitch = 'mood1';
        /** @type {boolean} */ this.loop = false;

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
            Session.currentPage.subscribe((nextPage) => {
                if (
                    AudioService.paused ||
                    AudioService.trackPosition.current() <= 0 ||
                    nextPage == 'music' ||
                    nextPage == 'music-playlist'
                )
                    return;

                PlayMusicDialog.show(this.currentTrack, this.currentVolume, AudioService.trackPosition.current());
            }),
            AudioService.ended.subscribe(() => {
                if (this.currentTrackIndex + 1 >= this.playlist.tracks.length && !this.loop) return;
                this.changeTrackBy(1);
            }, true)
        );

        window.addEventListener('hashchange', (e) => {
            if (
                AudioService.paused ||
                AudioService.trackPosition.current() <= 0 ||
                location.hash == 'music' ||
                location.hash == 'music-playlist'
            )
                return;

            PlayMusicDialog.show(this.currentTrack, this.currentVolume, AudioService.trackPosition.current() ?? 0);
        });

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));
    }

    async initializeData() {
        var playlistId = getQueryValue('guid');
        var trackId = getQueryValue('track');

        if (!playlistId) {
            var currentTrack = await MusicService.get(trackId);
            this.playlist = new PlaylistModel({ tracks: [new MusicModel(currentTrack)], isTemporary: true, genres: [] });
            this.currentTrackIndex = 0;
        } else {
            this.playlist = await PlaylistService.getPlaylist(playlistId);
            this.playlist.tracks = this.playlist.tracks.map((x) => new MusicModel(x));
            this.currentTrackIndex = Number.parseInt(trackId ?? '0');
        }

        this.currentTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.currentTrackIndex]);
        await AudioService.changeTrack(this.currentTrack);
        await this.requestFullUpdate();
    }

    render() {
        if (this.playlist?.isTemporary || !this.playlist?.name) document.title = this.currentTrack.displayName;
        else document.title = this.playlist.name + ' - ' + this.currentTrack.name;
        if (this.currentTrackIndex) document.title = this.currentTrack.displayName;
        return renderMusicPlaylist(this);
    }

    async toggleCurrentTrack() {
        try {
            if (AudioService.paused) await AudioService.play();
            else await AudioService.pause();
        } catch {
            await this.changeTrackBy(1);
        }

        this.requestFullUpdate();
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
        this.currentTrackIndex = index;
        this.currentTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.currentTrackIndex]);
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.currentTrackIndex]);

        changePage(Session.currentPage.current(), `?guid=${this.playlist.id}&track=${this.currentTrackIndex}`, false);

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
     * @param {keyof  MusicModel} property
     * @param {any} value
     */
    async changeProperty(property, value) {
        if (property == 'displayName' || property == 'instruments' || property == 'instrumentTypes') return;
        if (property == 'rating') this.updatedTrack[property] = value;
        else if (property == 'complete') this.updatedTrack[property] = value;
        else {
            /** @type {any} */ (this.updatedTrack[property]) = value;
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

    openInstrumentsDialog() {
        var instruments = Session.instruments
            .current()
            .map((item, index) => new GenreModel({ id: `${index}`, name: item.name, section: item.type }));
        var allowedInstruments = this.updatedTrack.instruments.map(
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
            this.requestFullUpdate();
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
                Session.instruments.next(await MusicService.getInstruments());

                genreDialog.requestFullUpdate();
            }
        );
        genreDialog.addEventListener(
            'remove-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                await MusicService.removeInstrument(/** @type {InstrumentType} */ (e.detail.section), e.detail.name);
                genreDialog.options.genres = genreDialog.options.genres.filter((x) => x.name != e.detail.name);
                Session.instruments.next(await MusicService.getInstruments());
                genreDialog.requestFullUpdate();
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
        this.requestFullUpdate();
    }

    randomize() {
        this.playlist.tracks = randomizeArray(this.playlist.tracks);
        this.currentTrackIndex = 0;
        this.requestFullUpdate();
    }

    async showLyrics() {
        try {
            var offset = -1;
            if (this.currentTrack.lyrics?.length > 0)
                var dialog = await LyricsDialog.startShowing(
                    this.currentTrack.displayName,
                    this.currentTrack.lyrics,
                    AudioService,
                    false
                );
            else {
                offset = 0;
                var lyrics = await MusicService.getLyrics(this.currentTrack.hash);
                var dialog = await LyricsDialog.startShowing(lyrics.title, lyrics.text, AudioService, true);
            }

            dialog.addEventListener('playlist-saved', async () => {
                this.updatedTrack.lyrics = dialog.lyrics;
                await this.updateTrack();
            });

            dialog.addEventListener('request-new-lyrics', async () => {
                offset++;
                try {
                    var newLyrics = await MusicService.getLyrics(this.currentTrack.hash, offset);
                    dialog.updateLyrics(newLyrics.title, newLyrics.text);
                } catch {
                    dialog.canNext = false;
                    dialog.requestFullUpdate();
                }
            });
        } catch {
            MessageSnackbar.popup('Es konnten leider keine passenden Lyrics gefunden werden.', 'error');
        }
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await AudioService.reset();
        await this.updateTrack();
    }
}
