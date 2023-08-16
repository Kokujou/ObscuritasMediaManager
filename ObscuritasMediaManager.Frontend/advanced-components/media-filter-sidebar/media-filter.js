import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import {
    ContentWarning,
    MediaCategory,
    MediaModel,
    MediaStatus,
    Nation,
    TargetGroup,
} from '../../obscuritas-media-manager-backend-client.js';

export class MediaFilter {
    /** @type {{property: keyof MediaModel, translation: string}[]} */
    static get SortableProperties() {
        return [
            { property: 'name', translation: 'Name' },
            { property: 'release', translation: 'Release' },
            { property: 'rating', translation: 'Bewertung' },
            { property: null, translation: 'Keine Sortierung' },
        ];
    }

    /** @type {string} */ search;
    /** @type {'ascending' | 'descending'} */ sortingDirection = 'ascending';
    /** @type {keyof MediaModel} */ sortingProperty;
    status = new FilterEntry(MediaStatus, CheckboxState.Ignore);
    ratings = new FilterEntry([1, 2, 3, 4, 5], CheckboxState.Allow);
    genres = new FilterEntry(String, CheckboxState.Ignore);
    release = { min: null, max: null };
    language = new FilterEntry(Nation, CheckboxState.Ignore);
    category = new FilterEntry(MediaCategory, CheckboxState.Ignore);
    contentWarnings = new FilterEntry(ContentWarning, CheckboxState.Ignore);
    targetGroups = new FilterEntry(TargetGroup, CheckboxState.Ignore);
}
