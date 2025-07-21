import { PropertyValues } from 'lit-element';
import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeSortingProperties } from '../../data/recipe-sorting-properties';
import { Session } from '../../data/session';
import { SortingDirections } from '../../data/sorting-directions';
import { changePage } from '../../services/extensions/url.extension';
import { ImportFoodPage } from '../import-food-page/import-food-page';
import { renderRecipesPageStyles } from './recipes-page.css';
import { renderRecipesPage } from './recipes-page.html';

@customElement('recipes-page')
export class RecipesPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Rezepte';

    static override get styles() {
        return renderRecipesPageStyles();
    }

    // get filteredRecipes() {
    //     if (!this.filterSidebar?.filter) return [];
    //     var sorted = RecipeFilterService.filter(Session.recipes.current() ?? [], this.filterSidebar.filter);
    //     let sortingProperty = this.sortingProperty;
    //     if (sortingProperty != 'unset') sorted = sortBy(sorted, (x) => x[sortingProperty]);

    //     if (this.sortingDirection == 'ascending') return sorted;
    //     return sorted.reverse();
    // }

    @state() protected declare sortingProperty: keyof typeof RecipeSortingProperties;
    @state() protected declare sortingDirection: keyof typeof SortingDirections;

    constructor() {
        super();
        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
    }

    override async connectedCallback() {
        super.connectedCallback();

        Session.recipes.subscribe(() => this.requestFullUpdate(), true);
    }

    protected override firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated(_changedProperties);
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

    async showFileBrowser() {
        var filesToImport = await document.openFileBrowser('image/*');
        if (!filesToImport?.length) return;

        await ImportFoodPage.cacheFiles(filesToImport);
        changePage(ImportFoodPage, {});
    }

    submitFileBrowser() {}

    loadMoreItems() {}
}
