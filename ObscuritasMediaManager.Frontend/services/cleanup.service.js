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
}
