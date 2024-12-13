import { html } from 'lit-element';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { changePage } from '../../services/extensions/url.extension';
import { CreateRecipePage } from '../create-recipe-page/create-recipe-page';
import { RecipesPage } from './recipes-page';

export function renderRecipesPage(this: RecipesPage) {
    return html`
        <page-layout>
            <div id="filter-area"></div>
            <paginated-scrolling id="recipes-content" scrollTopThreshold="20" @scrollBottom="${() => this.loadMoreItems()}">
                <div id="items">
                    <div
                        id="add-recipe-icon"
                        icon="${Icons.Plus}"
                        class="recipe-tile"
                        @click="${() => changePage(CreateRecipePage)}"
                    ></div>
                    ${this.recipes.map(
                        (x) =>
                            html`
                                <recipe-tile
                                    class="recipe-tile"
                                    .recipe="${x}"
                                    @click="${() => changePage(CreateRecipePage, { recipeId: x.id })}"
                                >
                                    ${x.title}
                                </recipe-tile>
                            `
                    )}
                </div>
            </paginated-scrolling>
        </page-layout>
    `;
}
