import { LitElementBase } from '../../data/lit-element-base.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    MusicGenre,
    MusicModel,
    PlaylistModel,
    UpdateRequestOfPlaylistModel,
} from '../../obscuritas-media-manager-backend-client.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { PlaylistService } from '../../services/backend.services.js';
import { importDroppedFiles, importFiles } from '../../services/extensions/file.extension.js';
import { DialogBase } from '../dialog-base/dialog-base.js';
import { renderEditPlaylistDialogStyles } from './edit-playlist-dialog.css.js';
import { renderEditPlaylistDialog } from './edit-playlist-dialog.html.js';

export class EditPlaylistDialog extends LitElementBase {
    static get styles() {
        return renderEditPlaylistDialogStyles();
    }

    static get properties() {
        return {
            draggingFiles: { type: Boolean, reflect: false },
        };
    }

    /**
     * @param {PlaylistModel} playlist
     */
    static show(playlist) {
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

    render() {
        return renderEditPlaylistDialog(this);
    }

    /**
     * @template {keyof PlaylistModel} T
     * @param {T} propertyName
     * @param {PlaylistModel[T]} value
     */
    changeProperty(propertyName, value) {
        this.newPlaylist[propertyName] = value;
        this.requestFullUpdate();
    }

    /**
     * @param {MusicGenre} genre
     */
    addGenre(genre) {
        if (!genre || !Object.values(MusicGenre).includes(genre)) return;
        this.changeProperty('genres', this.newPlaylist.genres.concat(genre));
    }

    /**
     * @param {MusicGenre} genre
     */
    removeGenre(genre) {
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

    async openImportDialog() {
        try {
            var fileImportResult = await importFiles();
            this.newPlaylist.tracks = await MusicModel.createFromFiles(fileImportResult.files, fileImportResult.basePath);
            this.requestFullUpdate();
        } catch (err) {}
    }

    /**
     * @param {DragEvent} event
     */
    handleFilesDragOver(event) {
        if (!event.dataTransfer.types.includes('Files')) return;
        event.preventDefault();
        this.draggingFiles = true;
        this.requestFullUpdate();
    }

    /**
     * @param {DragEvent} event
     */
    async dropFiles(event) {
        event.preventDefault();
        var result = await importDroppedFiles(Array.from(event.dataTransfer.items).map((x) => x.getAsFile()));
        this.newPlaylist.tracks = this.newPlaylist.tracks.concat(...MusicModel.createFromFiles(result.files, result.basePath));
        this.requestFullUpdate();
        this.requestUpdate('newPlaylist');

        this.draggingFiles = false;
    }
}
