import { LitElementBase } from '../../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../../data/music.model.extended.js';
import { ContextMenu, ContextMenuItem } from '../../../native-components/context-menu/context-menu.js';
import { trashIcon } from '../../../pages/media-detail-page/images/trash-icon.svg.js';
import { revertIcon } from '../../../resources/inline-icons/general/revert-icon.svg.js';
import { renderAudioTileStyles } from './audio-tile.css.js';
import { renderAudioTile } from './audio-tile.html.js';

export class AudioTile extends LitElementBase {
    static get styles() {
        return renderAudioTileStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            image: { type: String, reflect: true },
            paused: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {ExtendedMusicModel} */ this.track = new ExtendedMusicModel();
        /** @type {string} */ this.image;
        this.paused = true;
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            /** @type {ContextMenuItem[]} */ var contextMenuItems = [];
            /** @type {ContextMenuItem} */ var softDeleteItem = {
                text: 'In Papierkorb verschieben',
                iconString: trashIcon(),
                action: () => this.dispatchEvent(new CustomEvent('soft-delete')),
            };
            /** @type {ContextMenuItem} */ var hardDeleteItem = {
                text: 'Endgültig löschen',
                iconString: trashIcon(),
                action: () => this.dispatchEvent(new CustomEvent('hard-delete')),
            };
            /** @type {ContextMenuItem} */ var restoreItem = {
                text: 'Wiederherstellen',
                iconString: revertIcon(),
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
