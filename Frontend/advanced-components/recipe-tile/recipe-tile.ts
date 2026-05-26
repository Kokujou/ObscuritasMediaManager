import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeModel, RecipeResponse } from '../../obscuritas-media-manager-backend-client';
import { renderRecipeTileStyles } from './recipe-tile.css';
import { renderRecipeTile } from './recipe-tile.html';

@customElement('recipe-tile')
export class RecipeTile extends LitElementBase {
    static override get styles() {
        return renderRecipeTileStyles();
    }

    @property({ type: Object }) declare public recipe: RecipeResponse;
    @property({ type: Boolean }) declare public compact: boolean;

    @state() declare protected showDeleted: boolean;

    get fullRecipe() {
        return this.recipe instanceof RecipeModel ? this.recipe : null;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    override render() {
        return renderRecipeTile.call(this);
    }

    notifyNationChanged() {
        this.dispatchEvent(new CustomEvent('change-nation'));
    }
}
