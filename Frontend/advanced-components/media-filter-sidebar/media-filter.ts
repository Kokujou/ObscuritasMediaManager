import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { FilterEntry } from '../../data/filter-entry';
import {
    ContentWarning,
    Language,
    MediaCategory,
    MediaModel,
    MediaStatus,
    TargetGroup,
} from '../../obscuritas-media-manager-backend-client';

export class MediaFilter {
    static get SortableProperties(): { property: keyof MediaModel | null; translation: string }[] {
        return [
            { property: 'name', translation: 'Name' },
            { property: 'release', translation: 'Release' },
            { property: 'rating', translation: 'Bewertung' },
            { property: null, translation: 'Keine Sortierung' },
        ];
    }

    static fromJSON(text: string) {
        var object = JSON.parse(text);
        for (var key in object) if (object[key]?.states) Object.setPrototypeOf(object[key], FilterEntry.prototype);
        return object;
    }

    search = '';
    sortingDirection: 'ascending' | 'descending' = 'ascending';
    sortingProperty: keyof MediaModel | null = null;
    status = new FilterEntry(Object.values(MediaStatus), CheckboxState.Ignore);
    ratings = new FilterEntry([0, 1, 2, 3, 4, 5], CheckboxState.Require);
    genres: FilterEntry<string>;
    release: { min: number | null; max: number | null } = { min: null, max: null };
    languages = new FilterEntry(Object.values(Language), CheckboxState.Require);
    category = new FilterEntry(Object.values(MediaCategory), CheckboxState.Ignore);
    contentWarnings = new FilterEntry(Object.values(ContentWarning), CheckboxState.Ignore);
    targetGroups = new FilterEntry(Object.values(TargetGroup), CheckboxState.Ignore);
    deleted = CheckboxState.Ignore;
    complete = CheckboxState.Ignore;

    constructor(genreIds: string[]) {
        this.genres = new FilterEntry(genreIds, CheckboxState.Ignore);
    }
}
