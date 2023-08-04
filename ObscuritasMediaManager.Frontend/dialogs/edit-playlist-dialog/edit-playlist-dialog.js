import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { LitElement } from '../../exports.js';
import { MusicGenre, PlaylistModel, UpdateRequestOfPlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { PlaylistService } from '../../services/backend.services.js';
import { importDroppedFiles, importFiles } from '../../services/extensions/file.extension.js';
import { DialogBase } from '../dialog-base/dialog-base.js';
import { renderEditPlaylistDialogStyles } from './edit-playlist-dialog.css.js';
import { renderEditPlaylistDialog } from './edit-playlist-dialog.html.js';

export class EditPlaylistDialog extends LitElement {
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
        dialog.oldPlaylist = new PlaylistModel(JSON.parse(JSON.stringify(playlist)));
        dialog.newPlaylist = new PlaylistModel(JSON.parse(JSON.stringify(playlist)));

        PageRouting.container.append(dialog);
        dialog.requestUpdate(undefined);

        return dialog;
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

    async accept() {
        await PlaylistService.updatePlaylistData(
            this.newPlaylist.id,
            new UpdateRequestOfPlaylistModel({ oldModel: this.oldPlaylist, newModel: this.newPlaylist })
        );
    }

    async decline() {
        this.remove();
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
        console.log('change property', propertyName, value);
        this.newPlaylist[propertyName] = value;
        this.requestUpdate(undefined);
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
        this.requestUpdate(undefined);
    }

    async openImportDialog() {
        try {
            var fileImportResult = await importFiles();
            this.newPlaylist.tracks = await ExtendedMusicModel.createFromFiles(fileImportResult.files, fileImportResult.basePath);
            this.requestUpdate(undefined);
        } catch (err) {
            console.trace('the import of files was aborted', err);
        }
    }

    /**
     * @param {DragEvent} event
     */
    handleFilesDragOver(event) {
        if (!event.dataTransfer.types.includes('Files')) return;
        event.preventDefault();
        this.draggingFiles = true;
        this.requestUpdate(undefined);
    }

    /**
     * @param {DragEvent} event
     */
    async dropFiles(event) {
        event.preventDefault();
        var result = await importDroppedFiles(Array.from(event.dataTransfer.items).map((x) => x.getAsFile()));
        this.newPlaylist.tracks = ExtendedMusicModel.createFromFiles(result.files, result.basePath);
        this.requestUpdate(undefined);

        this.draggingFiles = false;
    }
}
