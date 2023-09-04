import { LitElementBase } from '../../data/lit-element-base.js';
import { PlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { PlaylistService } from '../../services/backend.services.js';
import { renderPlaylistSelectionDialogStyles } from './playlist-selection-dialog.css.js';
import { renderPlaylistSelectionDialog } from './playlist-selection-dialog.html.js';

export class PlaylistSelectionDialog extends LitElementBase {
    static get styles() {
        return renderPlaylistSelectionDialogStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: false },
        };
    }

    /**
     * @returns {Promise<PlaylistModel>}
     */
    static async requestPlaylist() {
        var dialog = new PlaylistSelectionDialog();

        dialog.playlists = await PlaylistService.listPlaylists();

        document.body.append(dialog);
        dialog.requestFullUpdate();

        return new Promise((resolve) => {
            dialog.addEventListener('accept', (x) => {
                resolve(dialog.selectedPlaylist);
            });

            dialog.addEventListener('decline', (x) => {
                resolve(null);
                dialog.remove();
            });
        });
    }

    constructor() {
        super();
        /** @type {PlaylistModel[]} */ this.playlists = [];
        /** @type {PlaylistModel} */ this.selectedPlaylist = null;
    }

    render() {
        return renderPlaylistSelectionDialog(this);
    }
}
