import { MediaModel } from '../data/media.model.js';

export class MediaService {
    /**
     * @returns {Promise<MediaModel[]>}
     * @param {string} type
     */
    static async getAllMedia(type = '') {
        var response = await fetch(`https://localhost/ObscuritasMediaManager/api/media?type=${type}`);

        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {MediaModel[]} */ var mediaList = await response.json();
        return mediaList.map((media) => Object.assign(new MediaModel(), media));
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

    /**
     * @param {MediaModel} media
     */
    static async updateMedia(media) {
        var response = await fetch(`https://localhost/ObscuritasMediaManager/api/media`, {
            method: 'PUT',
            body: JSON.stringify(media),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    /**
     * @param {MediaModel} media
     * @param {string} image
     */
    static async addImageForMedia(media, image) {
        var response = await fetch(`https://localhost/ObscuritasMediaManager/api/media/${media.name}/type/${media.type}`, {
            method: 'PUT',
            body: JSON.stringify({ image: image }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    /**
     * @param {MediaModel} media
     */
    static async removeImageForMedia(media) {
        var response = await fetch(`https://localhost/ObscuritasMediaManager/api/media/${media.name}/type/${media.type}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }
}
