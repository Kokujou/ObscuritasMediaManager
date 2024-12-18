import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { renderRecipeTileStyles } from './recipe-tile.css';
import { renderRecipeTile } from './recipe-tile.html';

@customElement('recipe-tile')
export class RecipeTile extends LitElementBase {
    static override get styles() {
        return renderRecipeTileStyles();
    }

    @property({ type: Object }) public declare recipe: RecipeModel;
    @property({ type: Boolean }) public declare compact: boolean;

    override render() {
        return renderRecipeTile.call(this);
    }

    notifyNationChanged() {
        this.dispatchEvent(new CustomEvent('change-nation'));
    }
}
