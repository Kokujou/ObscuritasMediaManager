import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { RecipeModel, RecipeModelBase } from '../../obscuritas-media-manager-backend-client';
import { getRecipeTileContextMenuItems } from './recipe-context-menu-items';
import { renderRecipeTileStyles } from './recipe-tile.css';
import { renderRecipeTile } from './recipe-tile.html';

@customElement('recipe-tile')
export class RecipeTile extends LitElementBase {
    static override get styles() {
        return renderRecipeTileStyles();
    }

    @property({ type: Object }) declare public recipe: RecipeModelBase;
    @property({ type: Boolean }) declare public compact: boolean;

    @state() declare protected showDeleted: boolean;

    get fullRecipe() {
        return this.recipe instanceof RecipeModel ? this.recipe : null;
    }

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
}
