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

    @property({ type: Object }) public declare track: MusicModel;
    @property({ type: Boolean, reflect: true }) public declare paused: boolean;

    constructor() {
        super();
        this.paused = true;
        this.track = new MusicModel();
    }

    override connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            var contextMenuItems: ContextMenuItem[] = [
                {
                    text: 'Kopieren',
                    action: () => this.dispatchEvent(new CustomEvent('clipboard')),
                    icon: Icons.Clipboard,
                },
            ];
            var softDeleteItem: ContextMenuItem = {
                text: 'In Papierkorb verschieben',
                icon: Icons.Trash,
                action: () => this.dispatchEvent(new CustomEvent('soft-delete')),
            };
            var hardDeleteItem: ContextMenuItem = {
                text: 'Endgültig löschen',
                icon: Icons.Trash,
                action: () => this.dispatchEvent(new CustomEvent('hard-delete')),
            };
            var restoreItem: ContextMenuItem = {
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
