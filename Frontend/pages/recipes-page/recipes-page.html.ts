import { html } from 'lit-element';
import { RecipeSortingProperties } from '../../data/recipe-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';
import { LinkElement } from '../../native-components/link-element/link-element';
import { RecipeDetailPage } from '../recipe-detail-page/recipe-detail-page';
import { RecipesPage } from './recipes-page';

export function renderRecipesPage(this: RecipesPage) {
    return html`
        <page-layout>
            <div id="page">
                <paginated-scrolling id="recipes-content" scrollTopThreshold="20" @scrollBottom="${() => this.loadMoreItems()}">
                    <div id="items">
                        ${LinkElement.forPage(RecipeDetailPage, {}, html`<div id="add-recipe-icon"></div>`)}
                        ${this.filteredRecipes?.map((recipe) =>
                            LinkElement.forPage(
                                RecipeDetailPage,
                                { recipeId: recipe.id },
                                html` <recipe-tile class="recipe-tile" .recipe="${recipe}"> ${recipe.title} </recipe-tile> `
                            )
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
