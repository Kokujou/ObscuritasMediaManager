import { customElement, query, state } from 'lit-element/decorators';
import { RecipeFilter } from '../../advanced-components/recipe-filter/recipe-filter';
import { FilterEntry } from '../../data/filter-entry';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeSortingProperties } from '../../data/recipe-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { distinct, sortBy } from '../../services/extensions/array.extensions';
import { RecipeFilterService } from '../../services/recipe-filter.service';
import { renderRecipesPageStyles } from './recipes-page.css';
import { renderRecipesPage } from './recipes-page.html';

@customElement('recipes-page')
export class RecipesPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Rezepte';

    static override get styles() {
        return renderRecipesPageStyles();
    }

    get filteredRecipes() {
        if (!this.filterSidebar?.filter) return [];
        var sorted = RecipeFilterService.filter(this.recipes ?? [], this.filterSidebar.filter);
        let sortingProperty = this.sortingProperty;
        if (sortingProperty != 'unset') sorted = sortBy(sorted, (x) => x[sortingProperty]);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    @state() protected declare sortingProperty: keyof typeof RecipeSortingProperties;
    @state() protected declare sortingDirection: keyof typeof SortingDirections;
    @state() protected declare recipes: RecipeModel[] | undefined;

    @query('recipe-filter') protected declare filterSidebar: RecipeFilter | undefined;

    constructor() {
        super();
        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
    }

    override async connectedCallback() {
        super.connectedCallback();
        this.recipes = await RecipeService.getAllRecipes();
        for (var i = 0; i < 5; i++) this.recipes = this.recipes?.concat(this.recipes);
        this.filterSidebar!.filter.ingredients = new FilterEntry(distinct(this.recipes.flatMap((x) => x.ingredientNames)));
        this.requestFullUpdate();
    }

    updateSorting(sortingProperty: keyof typeof RecipeSortingProperties, sortingDirection: keyof typeof SortingDirections) {
        this.sortingProperty = sortingProperty;
        this.sortingDirection = sortingDirection;
        localStorage.setItem(
            `recipes.sorting`,
            JSON.stringify({ property: this.sortingProperty, direction: this.sortingDirection })
        );
        this.requestFullUpdate();
    }

    override render() {
        return renderRecipesPage.call(this);
    }

    loadMoreItems() {}
}