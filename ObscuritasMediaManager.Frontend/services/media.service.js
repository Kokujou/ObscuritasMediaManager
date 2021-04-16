import { MediaModel } from '../data/media.model.js';

export class MediaService {
    static async getAllMedia(type = '') {
        var response = await fetch(`https://localhost/ObscuritasMediaManager/api/media?type=${type}`);

        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        return response.json();
    }

    /**
     * @param {MediaModel[]} media
     */
    static async batchCreateMedia(media) {
        var response = await fetch('https://localhost/ObscuritasMediaManager/api/media', {
            method: 'POST',
            body: JSON.stringify(media),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }
}
