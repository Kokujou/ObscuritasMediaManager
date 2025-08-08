import { html } from 'lit-element';
import { Session } from '../../data/session';
import { LinkElement } from '../../native-components/link-element/link-element';
import { RecipeDetailPage } from '../recipe-detail-page/recipe-detail-page';
import { RecipesPage } from './recipes-page';

export function renderRecipesPage(this: RecipesPage) {
    return html`
        <page-layout>
            <div id="page">
                <paginated-scrolling id="recipes-content" scrollTopThreshold="20" @scrollBottom="${() => this.loadMoreItems()}">
                    <div id="items">
                        ${LinkElement.forPage(RecipeDetailPage, {}, html`<div class="add-icon" id="add-recipe-icon"></div>`)}
                        <link-element @click="${() => this.showFileBrowser()}">
                            <div class="add-icon" id="add-dish-icon"></div>
                        </link-element>
                        ${Session.recipes.current().map(
                            (recipe) => html`
                                <div id="food-tile">
                                    <img
                                        width="200px"
                                        height="200px"
                                        decoding="async"
                                        src="./Backend/api/recipe/${recipe.id}/thumb"
                                    />
                                    <div id="food-title">${recipe.title}</div>
                                </div>
                            `
                        )}
                    </div>
                </paginated-scrolling>
            </div>
        </page-layout>
    `;
}
