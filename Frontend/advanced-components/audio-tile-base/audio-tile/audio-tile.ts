import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../../data/lit-element-base';
import { ContextMenu, ContextMenuItem } from '../../../native-components/context-menu/context-menu';
import { MusicModel } from '../../../obscuritas-media-manager-backend-client';
import { Icons } from '../../../resources/inline-icons/icon-registry';
import { renderAudioTileStyles } from './audio-tile.css';
import { renderAudioTile } from './audio-tile.html';

@customElement('audio-tile')
export class AudioTile extends LitElementBase {
    static override get styles() {
        return renderAudioTileStyles();
    }

    @property({ type: Object }) protected track = new MusicModel();
    @property({ type: Boolean }) protected paused = true;

    override connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e: Event) => {
            e.preventDefault();

            /** @type {ContextMenuItem[]} */ var contextMenuItems = [
                {
                    text: 'Kopieren',
                    action: () => this.dispatchEvent(new CustomEvent('clipboard')),
                    icon: Icons.Clipboard,
                },
            ];
            /** @type {ContextMenuItem} */ var softDeleteItem = {
                text: 'In Papierkorb verschieben',
                icon: Icons.Trash,
                action: () => this.dispatchEvent(new CustomEvent('soft-delete')),
            };
            /** @type {ContextMenuItem} */ var hardDeleteItem = {
                text: 'Endgültig löschen',
                icon: Icons.Trash,
                action: () => this.dispatchEvent(new CustomEvent('hard-delete')),
            };
            /** @type {ContextMenuItem} */ var restoreItem = {
                text: 'Wiederherstellen',
                icon: Icons.Revert,
                action: () => this.dispatchEvent(new CustomEvent('restore')),
            };

            if (this.track.deleted) contextMenuItems.push(hardDeleteItem, restoreItem);
            else contextMenuItems.push(softDeleteItem);

            ContextMenu.popup(contextMenuItems, e);
        });
    }

    notifyMusicToggled() {
        this.dispatchEvent(new CustomEvent('musicToggled'));
    }

    override render() {
        return renderAudioTile.call(this);
    }
}
