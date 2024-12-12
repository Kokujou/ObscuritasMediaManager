import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import {
    Language,
    MusicGenre,
    MusicModel,
    PlaylistModel,
    UpdateRequestOfObject,
    UpdateRequestOfPlaylistModel,
} from '../../obscuritas-media-manager-backend-client';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { MusicService, PlaylistService } from '../../services/backend.services';
import { distinct } from '../../services/extensions/array.extensions';
import { DialogBase } from '../dialog-base/dialog-base';
import { renderEditPlaylistDialogStyles } from './edit-playlist-dialog.css';
import { renderEditPlaylistDialog } from './edit-playlist-dialog.html';

@customElement('edit-playlist-dialog')
export class EditPlaylistDialog extends LitElementBase {
    static override get styles() {
        return renderEditPlaylistDialogStyles();
    }

    static get properties() {
        return {
            draggingFiles: { type: Boolean, reflect: false },
        };
    }

    static show(playlist: PlaylistModel) {
        var dialog = new EditPlaylistDialog();
        playlist.genres ??= [];
        dialog.oldPlaylist = PlaylistModel.fromJS(JSON.parse(JSON.stringify(playlist))) ?? new PlaylistModel();
        dialog.newPlaylist = PlaylistModel.fromJS(JSON.parse(JSON.stringify(playlist))) ?? new PlaylistModel();

        PageRouting.container.append(dialog);
        dialog.requestFullUpdate();

        return new Promise((resolve) => {
            dialog.addEventListener('accept', async () => {
                try {
                    if (dialog.newPlaylist.id)
                        await PlaylistService.updatePlaylistData(
                            dialog.newPlaylist.id,
                            new UpdateRequestOfPlaylistModel({ oldModel: dialog.oldPlaylist, newModel: dialog.newPlaylist })
                        );
                    else await PlaylistService.createPlaylist(dialog.newPlaylist);

                    for (var track of dialog.newPlaylist.tracks) await dialog.updateTrackPlaylistProperties(track);

                    await MessageSnackbar.popup('Playlist was successfully added', 'success');
                    resolve();
                    dialog.remove();
                } catch (err) {
                    console.error(err);
                    await DialogBase.show('Ein Fehler ist beim bearbeiten der Playlist aufgetreten:' + err, {
                        declineActionText: 'Ok',
                    });
                }
            });

            dialog.addEventListener('decline', () => {
                resolve();
                dialog.remove();
            });
        });
    }

    get autocompleteGenres() {
        return Object.values(MusicGenre).filter((genre) => !this.newPlaylist.genres.some((x) => MusicGenre[x] == genre));
    }

    constructor() {
        super();
        /** @type {PlaylistModel} */ this.oldPlaylist = new PlaylistModel();
        /** @type {PlaylistModel} */ this.newPlaylist = new PlaylistModel();
        /** @type {boolean} */ this.draggingFiles;
    }

    override render() {
        return renderEditPlaylistDialog(this);
    }

    /**
     * @template {keyof PlaylistModel} T
     * @param {T} propertyName
     * @param {PlaylistModel[T]} value
     */
    changeProperty(propertyName: T, value: PlaylistModel[T]) {
        this.newPlaylist[propertyName] = value;
        this.requestFullUpdate();
    }

    /**
     * @param {MusicGenre} genre
     */
    addGenre(genre: MusicGenre) {
        if (!genre || !Object.values(MusicGenre).includes(genre)) return;
        this.changeProperty('genres', this.newPlaylist.genres.concat(genre));
    }

    /**
     * @param {MusicGenre} genre
     */
    removeGenre(genre: MusicGenre) {
        this.changeProperty(
            'genres',
            this.newPlaylist.genres.filter((x) => x != genre)
        );
    }

    async clearTracks() {
        var accepted = await DialogBase.show('Alle Tracks löschen?', {
            content:
                'Sind Sie sicher dass Sie alle ausgewählten Tracks löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
            acceptActionText: 'Ja',
            declineActionText: 'Nein',
        });

        if (!accepted) return;

        this.newPlaylist.tracks = [];
        this.requestFullUpdate();
    }

    async openImportDialog() {}

    /**
     * @param {DragEvent} event
     */
    handleFilesDragOver(event: DragEvent) {
        if (!event.dataTransfer.types.includes('Files')) return;
        event.preventDefault();
        this.draggingFiles = true;
        this.requestFullUpdate();
    }

    /**
     * @param {DragEvent} event
     */
    async dropFiles(event: DragEvent) {}

    /** @param {MusicModel} track */
    async updateTrackPlaylistProperties(track: MusicModel) {
        /** @type {MusicModel} */ var updatedTrack = {};
        if (this.newPlaylist.author?.length > 1) updatedTrack.author = this.newPlaylist.author;
        if (this.newPlaylist.language != Language.Unset) updatedTrack.language = this.newPlaylist.language;

        try {
            var newGenres = this.newPlaylist.genres ?? [];
            var oldGenres = this.oldPlaylist.genres ?? [];
            var removedGenres = oldGenres.filter((genre) => !newGenres.includes(genre));
            var addedGenres = newGenres.filter((genre) => !oldGenres.includes(genre));
            updatedTrack.genres = [...track.genres];
            if (addedGenres.length > 0) updatedTrack.genres = updatedTrack.genres.concat(newGenres);
            if (removedGenres.length > 0)
                updatedTrack.genres = updatedTrack.genres.filter((genre) => !removedGenres.includes(genre));
            updatedTrack.genres = distinct(updatedTrack.genres);

            await MusicService.update(track.hash, new UpdateRequestOfObject({ oldModel: track, newModel: updatedTrack }));
        } catch (err) {
            console.error(`error updating track ${track.name} to fit playlist properties`, err);
        }
    }
}
