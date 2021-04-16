export class StreamingService {
    static async BatchCreateStreamingEntries(streamingEntries) {
        var response = await fetch('https://localhost/ObscuritasMediaManager/api/streaming', {
            method: 'POST',
            body: JSON.stringify(streamingEntries),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status != 204) throw new Error('something went wrong, status ' + response.status);
    }
}
