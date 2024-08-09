import { MediaFilter } from '../advanced-components/media-filter-sidebar/media-filter.js';
import { CheckboxState } from '../data/enumerations/checkbox-state.js';
import { MediaModel } from '../obscuritas-media-manager-backend-client.js';
import { sortBy } from './extensions/array.extensions.js';
import { ObjectFilterService } from './object-filter.service.js';

export class MediaFilterService {
    /**
     *
     * @param {MediaModel[]} result
     * @param {MediaFilter} filter
     */
    static filter(result, filter) {
        ObjectFilterService.applyPropertyFilter(result, filter.ratings, 'rating');
        ObjectFilterService.applyArrayFilter(result, filter.genres, 'genres', (x) => x.id);
        ObjectFilterService.applyMultiPropertySearch(
            result,
            filter.search ?? '',
            'name',
            'description',
            'kanjiName',
            'romajiName',
            'germanName',
            'englishName'
        );
        ObjectFilterService.applyPropertyFilter(result, filter.status, 'status');
        ObjectFilterService.applyRangeFilter(result, filter.release, 'release');
        ObjectFilterService.applyPropertyFilter(result, filter.languages, 'language');
        ObjectFilterService.applyPropertyFilter(result, filter.category, 'type');
        ObjectFilterService.applyArrayFilter(result, filter.contentWarnings, 'contentWarnings');
        ObjectFilterService.applyPropertyFilter(result, filter.targetGroups, 'targetGroup', CheckboxState.Ignore);
        ObjectFilterService.applyValueFilter(result, filter.deleted, 'deleted');
        ObjectFilterService.applyValueFilter(result, filter.complete, 'complete');

        if (!filter.sortingProperty) return result;
        var sorted = sortBy(result, (x) => x[filter.sortingProperty]);
        if (!filter.sortingDirection || filter.sortingDirection == 'ascending') return sorted;
        else return sorted.reverse();
    }
}
