import { MediaModel } from '../data/media.model.js';

export class MediaService {
    static async getMedia(name, type) {
        var response = await fetch(`/ObscuritasMediaManager/api/media/${name}/type/${type}`);

        if (response.status == 400) throw new Error(`the following media already exist: ${await response.json()}`);
        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {MediaModel[]} */ var media = await response.json();
        return Object.assign(new MediaModel(), media).decodeBase64();
    }

    /**
     * @returns {Promise<MediaModel[]>}
     * @param {string} type
     */
    static async getAllMedia(type = '') {
        var response = await fetch(`/ObscuritasMediaManager/api/media?type=${type}`);

        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {MediaModel[]} */ var mediaList = await response.json();
        return mediaList.map((media) => Object.assign(new MediaModel(), media).decodeBase64());
    }

    /**
     * @param {MediaModel[]} media
     */
    static async batchCreateMedia(media) {
        var response = await fetch('/ObscuritasMediaManager/api/media', {
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
        var response = await fetch(`/ObscuritasMediaManager/api/media`, {
            method: 'PUT',
            body: JSON.stringify(media),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    /**
     * @param {string} image
     * @param {string} name
     * @param {string} type
     */
    static async addImageForMedia(name, type, image) {
        var response = await fetch(`/ObscuritasMediaManager/api/media/${name}/type/${type}/image`, {
            method: 'PUT',
            body: JSON.stringify({ image: image }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    /**
     * @param {string} name
     * @param {string} type
     */
    static async removeImageForMedia(name, type) {
        var response = await fetch(`/ObscuritasMediaManager/api/media/${name}/type/${type}/image`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }
}
