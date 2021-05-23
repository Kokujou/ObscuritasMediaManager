import { MusicModel } from '../data/music.model.js';

export class MusicService {
    /**
     * @param {MusicModel[]} musicTracks
     */
    static async batchCreateMusicTracks(musicTracks) {
        var response = await fetch('/ObscuritasMediaManager/api/music', {
            method: 'POST',
            body: JSON.stringify(musicTracks),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    static async getAll() {
        var response = await fetch('/ObscuritasMediaManager/api/music');
        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {MusicModel[]} */ var mediaList = await response.json();
        return mediaList.map((tracks) => Object.assign(new MusicModel(), tracks));
    }
}
