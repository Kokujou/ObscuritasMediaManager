import { MediaModel } from '../obscuritas-media-manager-backend-client.js';

export class MediaFilterService {
    /**
     * @param {string } filter
     * @param {MediaModel[]} mediaList
     */
    static applyTextFilter(filter, mediaList) {
        if (filter)
            return mediaList.filter(
                (media) =>
                    media.name.toLowerCase().includes(filter.toLocaleLowerCase()) ||
                    media.name.toLowerCase().match(filter.toLowerCase())
            );

        return mediaList;
    }
}
