import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { MusicGenre } from '../../obscuritas-media-manager-backend-client.js';

export class MediaSearchFilter {
    /** @type {string} */ search;
    ratings = new FilterEntry(['1', '2', '3', '4', '5'], CheckboxState.Allow);
    genres = new FilterEntry(MusicGenre, CheckboxState.Ignore);
    /** @type {{ left: number, right: number }} */ episodeCountFilter = { left: 0, right: 9999 };
}
