export class PlaylistService {
    /**
     * @returns {Promise<string>}
     * @param {string[]} entries
     */
    static async createTemporaryPlaylist(entries) {
        var response = await fetch('/ObscuritasMediaManager/api/playlist/temp', {
            method: 'POST',
            body: JSON.stringify(entries),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);

        return await response.json();
    }

    /**
     * @returns {Promise<string[]>}
     * @param {string} guid
     */
    static async getTemporaryPlaylist(guid) {
        var response = await fetch(`/ObscuritasMediaManager/api/playlist/temp/${guid}`);
        if (response.status != 200) throw new Error('something went wrong, status ' + response.status);
        return await response.json();
    }
}
