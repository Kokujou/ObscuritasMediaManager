import { MusicModel } from '../data/music.model.js';

export class CleanupService {
    /** @returns {Promise<MusicModel[]>} */
    static async getBrokenAudioTracks() {
        try {
            var response = await fetch('/ObscuritasMediaManager/api/cleanup/music');
            if (response.status != 200) throw { status: response.status };
            /** @type {MusicModel[]} */ var responseArray = await response.json();
            return responseArray.map((x) => Object.assign(new MusicModel(), x));
        } catch (err) {}
    }

    /**
     * @param {string[]} trackHashes
     * @returns {Promise<string[]>}
     */
    static async cleanupMusicTracks(trackHashes) {
        try {
            var response = await fetch('/ObscuritasMediaManager/api/cleanup/music', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(trackHashes),
            });
            if (response.status == 200) return (await response.json()).failed;
            if (response.status == 204) return [];

            throw { status: response.status };
        } catch (err) {}
    }
}
