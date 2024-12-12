import { MediaFilter } from '../advanced-components/media-filter-sidebar/media-filter';
import { CheckboxState } from '../data/enumerations/checkbox-state';
import { MediaModel } from '../obscuritas-media-manager-backend-client';
import { sortBy } from './extensions/array.extensions';
import { ObjectFilterService } from './object-filter.service';

export class MediaFilterService {
    /**
     * @param {MediaModel[]} result
     * @param {MediaFilter} filter
     */
    static filter(result, filter) {
        if (filter.search) this.search(result, filter.search ?? '', true);
        ObjectFilterService.applyPropertyFilter(result, filter.ratings, 'rating');
        ObjectFilterService.applyArrayFilter(result, filter.genres, 'genres', (x) => x.id);
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

    /**
     * @param {MediaModel[]} list
     * @param {string} search
     * @param {boolean} includeDescription
     */
    static search(list, search, includeDescription) {
        ObjectFilterService.applyMultiPropertySearch(
            list,
            search ?? '',
            'name',
            'kanjiName',
            'romajiName',
            'germanName',
            'englishName',
            includeDescription ? 'description' : 'name'
        );
        return list;
    }
}
