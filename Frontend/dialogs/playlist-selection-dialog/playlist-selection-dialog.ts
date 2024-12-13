import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PlaylistModel } from '../../obscuritas-media-manager-backend-client';
import { PlaylistService } from '../../services/backend.services';
import { renderPlaylistSelectionDialogStyles } from './playlist-selection-dialog.css';
import { renderPlaylistSelectionDialog } from './playlist-selection-dialog.html';

@customElement('playlist-selection-dialog')
export class PlaylistSelectionDialog extends LitElementBase {
    static override get styles() {
        return renderPlaylistSelectionDialogStyles();
    }

    static async requestPlaylist() {
        var dialog = new PlaylistSelectionDialog();

        dialog.playlists = await PlaylistService.listPlaylists();

        document.body.append(dialog);
        dialog.requestFullUpdate();

        return new Promise<PlaylistModel | null>((resolve) => {
            dialog.addEventListener('accept', (x) => {
                resolve(dialog.selectedPlaylist!);
            });

            dialog.addEventListener('decline', (x) => {
                resolve(null);
                dialog.remove();
            });
        });
    }

    playlists: PlaylistModel[] = [];
    selectedPlaylist: PlaylistModel | null = null;

    override render() {
        return renderPlaylistSelectionDialog.call(this);
    }
}
