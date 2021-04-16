import { MediaModel } from '../data/media.model.js';

export class MediaService {
    /**
     * @param {MediaModel[]} media
     */
    static async batchCreateMedia(media) {
        var result = await fetch('https://localhost/ObscuritasMediaManager/api/media', {
            method: 'POST',
            body: JSON.stringify(media),
            headers: { 'Content-Type': 'application/json' },
        });

        if (result.status != 204) throw new Error('something went wrong, status ' + result.status);
    }
}
