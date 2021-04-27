import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { MediaSearch } from './media-search.js';

export class MediaSearchFilterData {
    /** @type {string} */ searchText;
    /** @type {number[]} */ ratingFilter = [1, 2, 3, 4, 5];
    /** @type {{ left: number, right: number }} */ episodeCountFilter = { left: 0, right: 9999 };
    /** @type {GenreDialogResult} */ genreFilter = new GenreDialogResult();

    /**
     * @param {MediaSearch} instance
     */
    static fromInstance(instance) {
        var filterData = new MediaSearchFilterData();
        filterData.searchText = instance.searchText;
        filterData.ratingFilter = instance.ratingFilter;
        filterData.episodeCountFilter = instance.episodeCountFilter;
        filterData.genreFilter = instance.genreFilter;

        return filterData;
    }
}
