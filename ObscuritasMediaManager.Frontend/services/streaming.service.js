import { StreamingEntryModel } from '../data/streaming-entry.model.js';

export class StreamingService {
    /**
     * @param {StreamingEntryModel[]} streamingEntries
     */
    static async BatchCreateStreamingEntries(streamingEntries) {
        var response = await fetch('/ObscuritasMediaManager/api/streaming', {
            method: 'POST',
            body: JSON.stringify(streamingEntries.map((x) => x)),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }

    static async getStreamingEntries(name, type) {
        var response = await fetch(`/ObscuritasMediaManager/api/streaming/${name}/type/${type}`, {
            method: 'GET',
        });

        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {StreamingEntryModel[]} */ var entryList = await response.json();
        return entryList.map((x) => Object.assign(new StreamingEntryModel(), x));
    }

    static async getStreamingEntry(name, type, season, episode) {
        var response = await fetch(`/ObscuritasMediaManager/api/streaming/${name}/type/${type}/season/${season}/episode/${episode}`, {
            method: 'GET',
        });

        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        /** @type {StreamingEntryModel} */ var entry = await response.json();
        return Object.assign(new StreamingEntryModel(), entry);
    }
}
