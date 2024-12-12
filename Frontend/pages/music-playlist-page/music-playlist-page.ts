import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher';
import { InteropQuery } from '../../client-interop/interop-query';
import { Session } from '../../data/session';
import { LyricsDialog } from '../../dialogs/audio-subtitle-dialog/lyrics-dialog';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { MusicGenre, MusicModel, PlaylistModel, UpdateRequestOfObject } from '../../obscuritas-media-manager-backend-client';
import { noteIcon } from '../../resources/inline-icons/general/note-icon.svg';
import { AudioService } from '../../services/audio-service';
import { MusicService, PlaylistService } from '../../services/backend.services';
import { ClientInteropService } from '../../services/client-interop-service';
import { distinct, randomizeArray } from '../../services/extensions/array.extensions';
import { changePage } from '../../services/extensions/url.extension';
import { MediaFilterService } from '../../services/media-filter.service';
import { AudioFileExtensions } from './audio-file-extensions';
import { renderMusicPlaylistStyles } from './music-playlist-page.css';
import { MusicPlaylistPageTemplate } from './music-playlist-page.html';

export class MusicPlaylistPage extends MusicPlaylistPageTemplate {
    static pageName = 'music-playlist-page';
    static isPage = true;
    static icon = noteIcon();

    static override get styles() {
        return renderMusicPlaylistStyles();
    }

    static get properties() {
        return {
            hoveredRating: { type: Number, reflect: false },
            moodToSwitch: { type: String, reflect: true },
        };
    }

    get autocompleteGenres() {
        return Object.values(MusicGenre).filter(
            (genre) => !this.updatedTrack.genres?.some((x) => MusicGenre[x] == genre) && genre != MusicGenre.Unset
        );
    }

    get audioSource() {
        if (!this.updatedTrack?.path) return;
        return `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(this.updatedTrack?.path)}`;
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

    get sourceMediaId() {
        return MediaFilterService.search([...Session.mediaList.current()], this.updatedTrack.source, false)[0]?.id;
    }

    constructor() {
        super();
        /** @type {number} */ this.trackIndex = 0;
        /** @type {string} */ this.playlistId = null;
        /** @type {string} */ this.trackHash = null;
        /** @type {boolean} */ this.createNew = false;

        /** @type {MusicModel} */ this.updatedTrack = null;
    }

    async override connectedCallback() {
        await super.connectedCallback();

        this.initializeData();
        this.subscriptions.push(
            Session.currentPage.subscribe((nextPage) => {
                PlayMusicDialog.show(this.updatedTrack, AudioService.volume, AudioService.trackPosition.current());
            }),
            AudioService.ended.subscribe(() => {
                console.log('track ended', new Date().toTimeString());
                if (this.trackIndex + 1 >= this.playlist.tracks.length && !this.loop) return;
                this.changeTrackBy(1);
            }),
            AudioService.changed.subscribe(() => {
                this.requestFullUpdate();
            })
        );

        window.addEventListener('hashchange', (e) => {
            PlayMusicDialog.show(this.updatedTrack, AudioService.volume, AudioService.trackPosition.current() ?? 0);
        });

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));
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

        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);

        AudioService.changeTrack(this.updatedTrack?.path);
        await this.requestFullUpdate();
    }

    override render() {
        if (!this.updatedTrack) return;
        var title = '';
        if (this.createNew) title = 'Neuer Track' + (this.updatedTrack.name ? ` - ${this.updatedTrack.name}` : '');
        else if (this.playlist?.isTemporary || !this.playlist?.name) title = this.updatedTrack?.displayName;
        else title = this.playlist.name + ' - ' + this.updatedTrack.name;
        if (document.title != title) document.title = title;
        return super.render();
    }

    async toggleCurrentTrack() {
        if (!this.updatedTrack.path) return await MessageSnackbar.popup('Kein Pfad ausgewählt', 'error');
        if (AudioService.currentTrackPath != this.updatedTrack.path) await AudioService.changeTrack(this.updatedTrack?.path);
        try {
            if (AudioService.paused) await AudioService.play(this.updatedTrack.path);
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
        if (this.playlist.tracks.length == 1) return;
        this.trackIndex = index;
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);

        changePage(MusicPlaylistPage, { playlistId: this.playlist.id, trackIndex: this.trackIndex }, false);

        await this.requestFullUpdate();
        await AudioService.play(this.updatedTrack?.path);
    }

    /**
     * @param { number} newVolume
     */
    async changeVolume(newVolume) {
        await AudioService.changeVolume(newVolume / 100);
        localStorage.setItem('volume', newVolume.toString());
        await this.requestFullUpdate();
    }

    /**
     * @template {keyof MusicModel} T
     * @param {T} property
     * @param {MusicModel[T]} value
     */
    async changeProperty(property, value) {
        try {
            if (this.updatedTrack.hash) {
                /** @type {any} */ const { oldModel, newModel } = { oldModel: {}, newModel: {} };
                oldModel[property] = this.updatedTrack[property];
                newModel[property] = value;
                var updated = await MusicService.update(
                    this.updatedTrack.hash,
                    new UpdateRequestOfObject({ oldModel, newModel })
                );
                this.updatedTrack = updated;
                this.playlist.tracks[this.trackIndex] = updated;
            } else {
                this.updatedTrack[property] = value;
                this.playlist.tracks[this.trackIndex][property] = value;
                if (property == 'instruments') {
                    this.updatedTrack.instrumentNames = this.updatedTrack.instruments.map((x) => x.name);
                    this.updatedTrack.instrumentTypes = distinct(this.updatedTrack.instruments.map((x) => x.type));
                }
            }
            await this.requestFullUpdate();
        } catch (err) {}
    }

    async showLanguageSwitcher() {
        var parent = this.shadowRoot!.querySelector('#music-player-container');
        var result = await LanguageSwitcher.spawnAt(parent, this.updatedTrack.language);
        if (!result) return;
        this.changeProperty('language', result);
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
        /** @type {HTMLInputElement}*/ var input = this.shadowRoot!.querySelector('#complete-check');
        await this.changeProperty('complete', input.checked);
    }

    async changeCurrentTrackPath() {
        var extensions = { 'Audio-Files': AudioFileExtensions };
        /** @type {string[]} */ var filePaths = await ClientInteropService.executeQuery({
            query: InteropQuery.RequestFiles,
            payload: /** @type {FilesQueryRequest} */ { multiselect: false, nameExtensionMap: extensions },
        });
        if (!filePaths || filePaths.length != 1) return;

        this.changeProperty('path', filePaths[0]);
        this.requestFullUpdate();
        AudioService.changeTrack(this.updatedTrack?.path);
    }

    randomize() {
        this.playlist.tracks = randomizeArray(this.playlist.tracks);
        this.changeTrack(0);
        this.requestFullUpdate();
    }

    async showLyrics() {
        try {
            var dialog = await LyricsDialog.startShowing(this.updatedTrack);
            dialog.addEventListener('lyrics-saved', async () => {
                await this.changeProperty('lyrics', dialog.lyrics);
                MessageSnackbar.popup('The lyrics have been successfully saved', 'success');
                await dialog.requestFullUpdate();
            });
        } catch {
            MessageSnackbar.popup('Es konnten leider keine passenden Lyrics gefunden werden.', 'error');
        }
    }

    async createTrack() {
        var trackHash = await MusicService.createMusicTrack(this.updatedTrack);
        changePage(MusicPlaylistPage, { trackHash });
        this.createNew = false;
        this.requestFullUpdate();
    }

    switchSelectedMood(mood) {
        this.moodToSwitch = mood;
        this.requestFullUpdate();
    }

    async disoverride connectedCallback() {
        await super.disconnectedCallback();
        await AudioService.reset();
    }
}
