import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { renderRecipesPageStyles } from './recipes-page.css';
import { renderRecipesPage } from './recipes-page.html';

@customElement('recipes-page')
export class RecipesPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Rezepte';

    static override get styles() {
        return renderRecipesPageStyles();
    }

    @state() protected declare recipes: RecipeModel[] | undefined;

    override async connectedCallback() {
        super.connectedCallback();
        this.recipes = await RecipeService.getAllRecipes();
        this.requestFullUpdate();
    }

    override render() {
        return renderRecipesPage.call(this);
    }

    loadMoreItems() {}
}
