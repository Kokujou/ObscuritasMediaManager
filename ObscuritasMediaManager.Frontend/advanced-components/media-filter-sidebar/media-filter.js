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
    /** @type {{property: keyof MediaModel | null, translation: string}[]} */
    static get SortableProperties() {
        return [
            { property: 'name', translation: 'Name' },
            { property: 'release', translation: 'Release' },
            { property: 'rating', translation: 'Bewertung' },
            { property: null, translation: 'Keine Sortierung' },
        ];
    }

    /**
     * @param {string} text
     */
    static fromJSON(text) {
        var object = JSON.parse(text);
        for (var key in object) if (object[key]?.states) Object.setPrototypeOf(object[key], FilterEntry.prototype);
        return object;
    }

    /** @type {string} */ search = '';
    /** @type {'ascending' | 'descending'} */ sortingDirection = 'ascending';
    /** @type {keyof MediaModel | null} */ sortingProperty = null;
    status = new FilterEntry(Object.values(MediaStatus), CheckboxState.Ignore);
    ratings = new FilterEntry([1, 2, 3, 4, 5], CheckboxState.Require);
    /** @type {FilterEntry<string>} */ genres;
    release = { min: null, max: null };
    languages = new FilterEntry(Object.values(Nation), CheckboxState.Require);
    category = new FilterEntry(Object.values(MediaCategory), CheckboxState.Ignore);
    contentWarnings = new FilterEntry(Object.values(ContentWarning), CheckboxState.Ignore);
    targetGroups = new FilterEntry(Object.values(TargetGroup), CheckboxState.Ignore);

    /**
     * @param {string[]} genreIds
     */
    constructor(genreIds) {
        this.genres = new FilterEntry(genreIds, CheckboxState.Ignore);
    }
}
