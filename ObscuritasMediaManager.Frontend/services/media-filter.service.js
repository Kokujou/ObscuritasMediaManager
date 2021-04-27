import { MediaModel } from '../data/media.model.js';
import { GenreDialogResult } from '../dialogs/dialog-result/genre-dialog.result.js';

export class MediaFilterService {
    /**
     * @param {MediaModel[]} mediaList
     * @param {number[]} filter
     */
    static applyRatingFilter(filter, mediaList) {
        return mediaList.filter((media) => filter.includes(media.rating) || filter.length == 5);
    }

    /**
     * @param {GenreDialogResult} filter
     * @param {MediaModel[]} mediaList
     */
    static applyGenreFilter(filter, mediaList) {
        return mediaList.filter(
            (media) =>
                filter.acceptedGenres.every((genre) => media.genres.includes(genre.name)) &&
                media.genres.every((genre) => filter.forbiddenGenres.every((x) => x.name != genre))
        );
    }

    /**
     * @param {string } filter
     * @param {MediaModel[]} mediaList
     */
    static applyTextFilter(filter, mediaList) {
        if (filter)
            return mediaList.filter(
                (media) =>
                    media.name.toLowerCase().includes(filter.toLocaleLowerCase()) || media.name.toLowerCase().match(filter.toLowerCase())
            );

        return mediaList;
    }
}
