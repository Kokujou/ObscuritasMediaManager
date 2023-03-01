import { html } from '../../exports.js';
import { changePage, getPageName } from '../../services/extensions/url.extension.js';
import { CreateRecipePage } from '../create-recipe-page/create-recipe-page.js';
import { RecipesPage } from './recipes-page.js';

/**
 * @param { RecipesPage } recipesPage
 */
export function renderRecipesPage(recipesPage) {
    return html`
        <page-layout>
            <div id="filter-area"></div>
            <paginated-scrolling
                id="recipes-content"
                scrollTopThreshold="20"
                @scrollBottom="${() => recipesPage.loadMoreItems()}"
            >
                <div id="items">
                    <div
                        id="add-recipe-icon"
                        class="recipe-tile"
                        @click="${() => changePage(getPageName(CreateRecipePage))}"
                    ></div>
                    ${recipesPage.recipes.map(
                        (x) =>
                            html`
                                <recipe-tile
                                    class="recipe-tile"
                                    .recipe="${x}"
                                    @click="${() => changePage(getPageName(CreateRecipePage), `?recipe=${x.id}`)}"
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
