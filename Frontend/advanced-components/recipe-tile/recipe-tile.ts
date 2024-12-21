import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { getRecipeTileContextMenuItems } from './recipe-context-menu-items';
import { renderRecipeTileStyles } from './recipe-tile.css';
import { renderRecipeTile } from './recipe-tile.html';

@customElement('recipe-tile')
export class RecipeTile extends LitElementBase {
    static override get styles() {
        return renderRecipeTileStyles();
    }

    @property({ type: Object }) public declare recipe: RecipeModel;
    @property({ type: Boolean }) public declare compact: boolean;

    @state() protected declare showDeleted: boolean;

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('contextmenu', (e) => {
            if (this.compact) return;
            e.preventDefault();
            ContextMenu.popup(getRecipeTileContextMenuItems.call(this), e);
        });
    }

    override render() {
        return renderRecipeTile.call(this);
    }

    notifyNationChanged() {
        this.dispatchEvent(new CustomEvent('change-nation'));
    }

    notifyImageRemoved() {
        this.dispatchEvent(new CustomEvent('remove-image'));
    }
}
