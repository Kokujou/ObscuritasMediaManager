import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { renderRecipesPageStyles } from './recipes-page.css';
import { renderRecipesPage } from './recipes-page.html';

@customElement('recipes-page')
export class RecipesPage extends LitElementBase {
    static isPage = true;
    static pageName = 'Rezepte';

    static override get styles() {
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

    override async connectedCallback() {
        super.connectedCallback();
        this.recipes = await RecipeService.getAllRecipes();
        this.requestFullUpdate();
    }

    override render() {
        return renderRecipesPage(this);
    }

    loadMoreItems() {}
}
