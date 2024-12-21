import { customElement, property } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { FilterEntry } from '../../data/filter-entry';
import { LitElementBase } from '../../data/lit-element-base';
import { RecipeSortingProperties } from '../../data/recipe-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';
import { RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { KeyOfType } from '../../services/object-filter.service';
import { RecipeFilterOptions } from './recipe-filter-options';
import { renderRecipeFilterStyles } from './recipe-filter.css';
import { renderRecipeFilter } from './recipe-filter.html';

@customElement('recipe-filter')
export class RecipeFilter extends LitElementBase {
    static override get styles() {
        return renderRecipeFilterStyles();
    }

    @property() public declare sortingProperty: keyof typeof RecipeSortingProperties;
    @property() public declare sortingDirection: keyof typeof SortingDirections;

    public declare filter: RecipeFilterOptions;

    constructor() {
        super();

        var cachedFilterString = localStorage.getItem('recipes.filter');
        this.filter = new RecipeFilterOptions();
        if (cachedFilterString) this.filter = RecipeFilterOptions.fromJSON(cachedFilterString);

        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
        if (
            !Object.keys(RecipeFilterOptions).every((property) =>
                Object.keys(new RecipeModel()).concat(['unset']).includes(property)
            )
        ) {
            var missingProperties = Object.keys(RecipeFilterOptions).filter(() =>
                Object.keys(new RecipeModel()).concat(['unset'])
            );
            alert("mismatch in sorting properties, the object might've changed:" + missingProperties);
            throw new Error("mismatch in sorting properties, the object might've changed" + missingProperties);
        }
    }

    override render() {
        return renderRecipeFilter.call(this);
    }

    setFilterEntryValue<T extends string | number | symbol>(
        filter: FilterEntry<T>,
        enumKey: keyof FilterEntry<T>['states'],
        state: CheckboxState
    ) {
        filter.states[enumKey] = state;
        this.notifyFilterUpdated();
    }

    setfilterEntry<T extends Exclude<keyof RecipeFilterOptions, KeyOfType<RecipeFilterOptions, FilterEntry<any>>>>(
        filter: T,
        state: RecipeFilterOptions[T]
    ) {
        this.filter[filter] = state;
        this.notifyFilterUpdated();
    }

    setArrayFilter<T extends KeyOfType<RecipeFilterOptions, FilterEntry<any>>>(filter: T, value: CheckboxState) {
        for (var key in this.filter[filter].states) (this.filter[filter] as FilterEntry<any>).states[key as any] = value;
        this.notifyFilterUpdated();
    }

    resetAllFilters() {
        var newFilter = new RecipeFilterOptions();
        Object.assign(this.filter, newFilter);
        this.sortingDirection = 'ascending';
        this.sortingProperty = 'unset';
        this.notifyFilterUpdated();
        this.dispatchEvent(
            new CustomEvent('sortingUpdated', {
                detail: {
                    property: this.sortingProperty,
                    direction: this.sortingDirection,
                },
            })
        );
        this.requestFullUpdate();
    }

    handleDropdownChange<T extends KeyOfType<RecipeFilterOptions, FilterEntry<any>>>(filter: T, selectedValues: string[]) {
        Object.keys(this.filter[filter].states).forEach((key) => {
            this.setFilterEntryValue(
                this.filter[filter],
                key,
                selectedValues.includes(key) ? CheckboxState.Ignore : CheckboxState.Forbid
            );
        });
    }

    notifyFilterUpdated() {
        localStorage.setItem('recipes.filter', JSON.stringify(this.filter));
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
        this.requestFullUpdate();
    }

    changeSorting(
        property: keyof typeof RecipeSortingProperties | null = null,
        direction: keyof typeof SortingDirections | null = null
    ) {
        if (property) this.sortingProperty = property;
        if (direction) this.sortingDirection = direction;
        this.requestFullUpdate();
        this.dispatchEvent(
            new CustomEvent('sortingUpdated', {
                detail: {
                    property: this.sortingProperty,
                    direction: this.sortingDirection,
                },
            })
        );
    }
}
