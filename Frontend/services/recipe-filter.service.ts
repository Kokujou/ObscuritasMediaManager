import { RecipeFilterOptions } from '../advanced-components/recipe-filter/recipe-filter-options';
import { TimeSpan } from '../data/timespan';
import { RecipeModel } from '../obscuritas-media-manager-backend-client';
import { ObjectFilterService } from './object-filter.service';

export class RecipeFilterService {
    static filter(recipes: RecipeModel[], filter: RecipeFilterOptions) {
        var filteredRecipes = [...recipes];

        ObjectFilterService.applyValueFilter(filteredRecipes, filter.showDeleted, 'deleted');
        ObjectFilterService.applyMultiPropertySearch(filteredRecipes, filter.search ?? '', 'title', 'formattedText');
        ObjectFilterService.applyPropertyFilter(filteredRecipes, filter.courses, 'course');
        ObjectFilterService.applyPropertyFilter(filteredRecipes, filter.techniques, 'technique');
        ObjectFilterService.applyArrayFilter(filteredRecipes, filter.ingredients, 'ingredientNames');
        ObjectFilterService.applyPropertyFilter(filteredRecipes, filter.nations, 'nation');
        ObjectFilterService.applyPropertyFilter(filteredRecipes, filter.ratings, 'rating');
        if (filter.maxDuration.toString() != new TimeSpan().toString())
            filteredRecipes = filteredRecipes.filter((x) =>
                TimeSpan.fromString(x[filter.filterByTime]).smallerThan(filter.maxDuration)
            );
        if (filter.maxDifficulty > 0)
            ObjectFilterService.applyRangeFilter(filteredRecipes, { min: 0, max: filter.maxDifficulty }, 'difficulty');
        // ObjectFilterService.applyValueFilter(filteredRecipes, filter.showComplete, 'complete');
        // ObjectFilterService.applyValueFilter(filteredRecipes, filter.showDeleted, 'deleted');

        return filteredRecipes;
    }
}
