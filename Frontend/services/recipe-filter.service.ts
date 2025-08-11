import { RecipeFilterOptions } from '../advanced-components/recipe-filter/recipe-filter-options';
import { TimeSpan } from '../data/timespan';
import { FoodModel, RecipeModel, RecipeModelBase } from '../obscuritas-media-manager-backend-client';
import { ObjectFilterService } from './object-filter.service';

export class RecipeFilterService {
    static filter(recipes: RecipeModelBase[], filter: RecipeFilterOptions) {
        var filteredItems = [...recipes];

        ObjectFilterService.applyValueFilter(filteredItems, filter.showDeleted, 'deleted');
        ObjectFilterService.applyPropertyFilter(filteredItems, filter.ratings, 'rating');
        if (filter.maxDifficulty > 0)
            ObjectFilterService.applyRangeFilter(filteredItems, { min: 0, max: filter.maxDifficulty }, 'difficulty');

        /* To be verified!! */
        ObjectFilterService.applyArrayFilter(filteredItems, filter.courses, 'tags');
        ObjectFilterService.applyArrayFilter(filteredItems, filter.techniques, 'tags');
        ObjectFilterService.applyArrayFilter(filteredItems, filter.nations, 'tags');

        var filteredRecipes = filteredItems.filter((x) => x instanceof RecipeModel);
        var filteredFood = filteredItems.filter((x) => x instanceof FoodModel);

        ObjectFilterService.applyArrayFilter(filteredRecipes, filter.ingredients, 'ingredientNames');
        ObjectFilterService.applyMultiPropertySearch(filteredFood, filter.search ?? '', 'title', 'description');
        ObjectFilterService.applyMultiPropertySearch(
            filteredRecipes,
            filter.search ?? '',
            'title',
            'description',
            'formattedText'
        );
        if (filter.maxDuration.toString() != new TimeSpan().toString())
            filteredRecipes = filteredRecipes.filter((x) =>
                TimeSpan.fromString(x[filter.filterByTime]).smallerThan(filter.maxDuration)
            );

        return filteredItems;
    }
}
