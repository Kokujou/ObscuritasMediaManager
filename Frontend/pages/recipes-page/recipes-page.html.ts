import { html } from 'lit-element';
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
                    </div>
                </paginated-scrolling>
            </div>
        </page-layout>
    `;
}
