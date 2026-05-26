import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeResponse } from '../../obscuritas-media-manager-backend-client';
import { renderRecipeTileBaseStyles } from './recipe-tile-base.css';
import { renderRecipeTileBase } from './recipe-tile-base.html';

@customElement('recipe-tile-base')
export class RecipeTileBase extends LitElementBase {
    static override get styles() {
        return renderRecipeTileBaseStyles();
    }

    @property({ type: Object }) declare public recipe: RecipeResponse;
    @property({ type: Boolean }) declare public compact: boolean;

    override render() {
        return renderRecipeTileBase.call(this);
    }
}
