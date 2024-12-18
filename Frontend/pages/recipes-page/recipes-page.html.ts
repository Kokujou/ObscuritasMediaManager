import { html } from 'lit-element';
import { RecipeSortingProperties } from '../../data/recipe-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';
import { changePage } from '../../services/extensions/url.extension';
import { RecipeDetailPage } from '../recipe-detail-page/recipe-detail-page';
import { RecipesPage } from './recipes-page';

export function renderRecipesPage(this: RecipesPage) {
    return html`
        <page-layout>
            <div id="page">
                <paginated-scrolling id="recipes-content" scrollTopThreshold="20" @scrollBottom="${() => this.loadMoreItems()}">
                    <div id="items">
                        ${this.filteredRecipes?.map(
                            (x) =>
                                html`
                                    <recipe-tile
                                        class="recipe-tile"
                                        .recipe="${x}"
                                        @click="${() => changePage(RecipeDetailPage, { recipeId: x.id })}"
                                    >
                                        ${x.title}
                                    </recipe-tile>
                                `
                        )}
                    </div>
                </paginated-scrolling>
                <div id="search-panel-container">
                    <recipe-filter
                        .sortingProperty="${this.sortingProperty}"
                        .sortingDirection="${this.sortingDirection}"
                        @filterChanged="${this.requestFullUpdate}"
                        @sortingUpdated="${(
                            e: CustomEvent<{
                                property: keyof typeof RecipeSortingProperties;
                                direction: keyof typeof SortingDirections;
                            }>
                        ) => this.updateSorting(e.detail.property, e.detail.direction)}"
                    ></recipe-filter>
                    <div id="result-count-label">${this.filteredRecipes.length} von ${this.recipes?.length ?? 0} Rezepte</div>
                </div>
            </div>
        </page-layout>
    `;
}
