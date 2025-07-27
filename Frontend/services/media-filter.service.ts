import { MediaFilter } from '../advanced-components/media-filter-sidebar/media-filter';
import { CheckboxState } from '../data/enumerations/checkbox-state';
import { sortBy } from '../extensions/array.extensions';
import { MediaModel } from '../obscuritas-media-manager-backend-client';
import { ObjectFilterService } from './object-filter.service';

export class MediaFilterService {
    static filter(result: MediaModel[], filter: MediaFilter) {
        if (filter.search)
            ObjectFilterService.applyMultiPropertySearch(
                result,
                filter.search ?? '',
                'name',
                'kanjiName',
                'romajiName',
                'germanName',
                'englishName',
                'description'
            );
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
        var property = filter.sortingProperty;
        var sorted = sortBy(result, (x) => x[property]);
        if (!filter.sortingDirection || filter.sortingDirection == 'ascending') return sorted;
        else return sorted.reverse();
    }

    static search(list: MediaModel[], search: string, includeDescription: boolean) {
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

    static find(list: MediaModel[], search: string, includeDescription: boolean) {
        return ObjectFilterService.findByProperties(
            list,
            search ?? '',
            'name',
            'kanjiName',
            'romajiName',
            'germanName',
            'englishName'
        );
    }
}
