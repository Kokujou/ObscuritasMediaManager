import { LitElementBase } from '../../data/lit-element-base.js';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client.js';
import { renderRecipeTileStyles } from './recipe-tile.css.js';
import { renderRecipeTile } from './recipe-tile.html.js';

export class RecipeTile extends LitElementBase {
    static get styles() {
        return renderRecipeTileStyles();
    }

    static get properties() {
        return {
            recipe: { type: Object, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {RecipeModel} */ this.recipe;
    }

    render() {
        return renderRecipeTile(this);
    }
}
