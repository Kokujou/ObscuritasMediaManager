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
                    <div id="add-recipe-icon" @click="${() => changePage(getPageName(CreateRecipePage))}"></div>
                </div>
            </paginated-scrolling>
        </page-layout>
    `;
}
