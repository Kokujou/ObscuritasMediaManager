import { LitElementBase } from '../../data/lit-element-base.js';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client.js';
import { RecipeService } from '../../services/backend.services.js';
import { renderRecipesPageStyles } from './recipes-page.css.js';
import { renderRecipesPage } from './recipes-page.html.js';

export class RecipesPage extends LitElementBase {
    static isPage = true;
    static pageName = 'Rezepte';

    static get styles() {
        return renderRecipesPageStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {RecipeModel[]} */ this.recipes = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        this.recipes = await RecipeService.getAllRecipes();
        this.requestUpdate(undefined);
    }

    render() {
        return renderRecipesPage(this);
    }

    loadMoreItems() {}
}
