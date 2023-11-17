import { LitElementBase } from '../../../data/lit-element-base.js';
import { ContextMenu, ContextMenuItem } from '../../../native-components/context-menu/context-menu.js';
import { MusicModel } from '../../../obscuritas-media-manager-backend-client.js';
import { Icons } from '../../../resources/inline-icons/icon-registry.js';
import { renderAudioTileStyles } from './audio-tile.css.js';
import { renderAudioTile } from './audio-tile.html.js';

export class AudioTile extends LitElementBase {
    static get styles() {
        return renderAudioTileStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            paused: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {MusicModel} */ this.track = new MusicModel();
        this.paused = true;
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e) => {
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

    render() {
        return renderAudioTile(this);
    }
}
