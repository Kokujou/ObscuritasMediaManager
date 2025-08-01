import { customElement, property, state } from 'lit-element/decorators';
import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher';
import { FilesQueryRequest } from '../../client-interop/files-query-request';
import { InteropQuery } from '../../client-interop/interop-query';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { LyricsDialog } from '../../dialogs/audio-subtitle-dialog/lyrics-dialog';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result';
import { EditPlaylistDialog } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog';
import { PlayMusicDialog } from '../../dialogs/play-music-dialog/play-music-dialog';

import { changePage } from '../../extensions/url.extension';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { MusicGenre, MusicModel, PlaylistModel, UpdateRequestOfObject } from '../../obscuritas-media-manager-backend-client';
import { noteIcon } from '../../resources/inline-icons/general/note-icon.svg';
import { AudioService } from '../../services/audio-service';
import { MusicService, PlaylistService } from '../../services/backend.services';
import { ClientInteropService } from '../../services/client-interop-service';
import { MediaFilterService } from '../../services/media-filter.service';
import { AudioFileExtensions } from './audio-file-extensions';
import { renderMusicPlaylistStyles } from './music-playlist-page.css';
import { renderMusicPlaylistPage } from './music-playlist-page.html';

@customElement('music-playlist-page')
export class MusicPlaylistPage extends LitElementBase {
    static isPage = true as const;
    static icon = noteIcon();

    static override get styles() {
        return renderMusicPlaylistStyles();
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
        return MediaFilterService.find(Session.mediaList.current(), this.updatedTrack.source!, false)?.id;
    }

    @property({ type: Number }) public declare trackIndex: number;
    @property() public declare playlistId: string;
    @property() public declare trackHash: string;
    @property({ type: Boolean, reflect: true }) public declare createNew: boolean;

    @state() protected declare updatedTrack: MusicModel;

    protected playlist = new PlaylistModel({ tracks: [] });
    protected currentTrack = new MusicModel();
    protected currentVolume = 0.1;
    protected maxPlaylistItems = 20;
    protected hoveredRating = 0;
    protected moodToSwitch: 'mood1' | 'mood2' = 'mood1';
    protected loop = false;

    constructor() {
        super();
        this.trackIndex = 0;
    }

    override async connectedCallback() {
        await super.connectedCallback();

        this.initializeData();
        this.subscriptions.push(
            Session.currentPage.subscribe((nextPage) => {
                PlayMusicDialog.show(this.updatedTrack, AudioService.volume, AudioService.trackPosition.current());
            }),
            AudioService.ended.subscribe(() => {
                if (this.trackIndex + 1 >= this.playlist.tracks.length && !this.loop) return;
                this.changeTrackBy(1);
            }),
            AudioService.changed.subscribe(() => {
                this.requestFullUpdate();
            })
        );

        window.addEventListener('hashchange', (e: Event) => {
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
            var currentTrack = await MusicService.get(this.trackHash!);
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
        if (!this.updatedTrack) return null;
        var title = '';
        if (this.createNew) title = 'Neuer Track' + (this.updatedTrack.name ? ` - ${this.updatedTrack.name}` : '');
        else if (this.playlist?.isTemporary || !this.playlist?.name) title = this.updatedTrack?.displayName;
        else title = this.playlist.name + ' - ' + this.updatedTrack.name;
        if (document.title != title) document.title = title;
        return renderMusicPlaylistPage.call(this);
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

    async changeTrackBy(offset: number) {
        var index = this.trackIndex + offset;
        if (index < 0) index = this.playlist.tracks.length - 1;
        if (index >= this.playlist.tracks.length) index = 0;
        await this.changeTrack(index);
    }

    async changeTrack(index: number) {
        if (this.playlist.tracks.length == 1) return;
        this.trackIndex = index;
        this.updatedTrack = Object.assign(new MusicModel(), this.playlist.tracks[this.trackIndex]);

        changePage(MusicPlaylistPage, { playlistId: this.playlist.id, trackIndex: this.trackIndex }, false);

        await this.requestFullUpdate();
        await AudioService.play(this.updatedTrack?.path);
    }

    async changeVolume(newVolume: number) {
        await AudioService.changeVolume(newVolume / 100);
        localStorage.setItem('volume', newVolume.toString());
        await this.requestFullUpdate();
    }

    async changeProperty<T extends keyof MusicModel>(property: T, value: MusicModel[T]) {
        try {
            if (this.updatedTrack.hash) {
                const { oldModel, newModel } = { oldModel: {} as any, newModel: {} as any };
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
                    this.updatedTrack.instrumentTypes = this.updatedTrack.instruments.map((x) => x.type).distinct();
                }
            }
            await this.requestFullUpdate();
        } catch (err) {}
    }

    async showLanguageSwitcher() {
        var parent = this.shadowRoot!.querySelector('#music-player-container')!;
        var result = await LanguageSwitcher.spawnAt(parent, this.updatedTrack.language);
        if (!result) return;
        this.changeProperty('language', result);
    }

    changeTrackPosition(value: string) {
        if (AudioService.duration == Infinity) return;
        AudioService.changePosition(Number.parseInt(value));
    }

    addGenre(genre: MusicGenre) {
        if (!genre || !Object.values(MusicGenre).includes(genre)) return;
        var newGenres = this.updatedTrack.genres.concat([genre]);
        this.changeProperty('genres', newGenres);
    }

    removeGenreKey(key: MusicGenre) {
        var newGenres = this.updatedTrack.genres.filter((x) => x != key);
        this.changeProperty('genres', newGenres);
    }

    async openInstrumentsDialog() {
        var genreDialog = await GenreDialog.startShowingWithInstruments(this.updatedTrack.instruments);
        genreDialog.addEventListener('accept', (e: CustomEvent<GenreDialogResult>) => {
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
        var input = this.shadowRoot!.querySelector('#complete-check')! as HTMLInputElement;
        await this.changeProperty('complete', input.checked);
    }

    async changeCurrentTrackPath() {
        var extensions = { 'Audio-Files': AudioFileExtensions };
        var filePaths = await ClientInteropService.executeQuery<string[]>({
            query: InteropQuery.RequestFiles,
            payload: { multiselect: false, nameExtensionMap: extensions } as FilesQueryRequest,
        });
        if (!filePaths || filePaths.length != 1) return;

        this.changeProperty('path', filePaths[0]);
        this.requestFullUpdate();
        AudioService.changeTrack(this.updatedTrack?.path);
    }

    randomize() {
        this.playlist.tracks = this.playlist.tracks.randomize();
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

    switchSelectedMood(mood: ('mood1' | 'mood2') & keyof MusicModel) {
        this.moodToSwitch = mood;
        this.requestFullUpdate();
    }

    override async disconnectedCallback() {
        await super.disconnectedCallback();
        await AudioService.reset();
    }
}
