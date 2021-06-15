import { InstrumentModel } from '../data/instrument.model.js';
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

        /** @type {MusicModel[]} */ var musicTracks = await response.json();
        return musicTracks.map((tracks) => Object.assign(new MusicModel(), tracks));
    }

    /**
     * @param {string} guid
     */
    static async get(guid) {
        var response = await fetch(`/ObscuritasMediaManager/api/music/${guid}`);
        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {MusicModel} */ var track = await response.json();
        return Object.assign(new MusicModel(), track);
    }

    /**
     * @param {MusicModel} updatedTrack
     */
    static async update(updatedTrack) {
        var response = await fetch('/ObscuritasMediaManager/api/music', {
            method: 'PUT',
            body: JSON.stringify(updatedTrack),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    static async getInstruments() {
        var response = await fetch(`/ObscuritasMediaManager/api/music/instruments`);
        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {InstrumentModel[]} */ var instruments = await response.json();
        return instruments;
    }
}
