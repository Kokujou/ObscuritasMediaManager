import { LitElementBase } from '../../data/lit-element-base.js';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client.js';
import { RecipeService } from '../../services/backend.services.js';
import { renderRecipesPageStyles } from './recipes-page.css.js';
import { renderRecipesPage } from './recipes-page.html.js';

export class RecipesPage extends LitElementBase {
    static get isPage() {
        return true;
    }

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
        document.title = 'Rezepte';
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
