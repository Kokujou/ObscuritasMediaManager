export class LocalPlaylistService {
    static exportPlaylist(name: string, tracks: { displayName: string; path: string }[]) {
        const m3uString = this.createPlaylist(tracks);
        var blob = new Blob([m3uString], { type: 'application/octet-stream' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = `${name}.m3u8`;
        document.body.appendChild(link);
        link.click();
    }

    static createPlaylist(tracks: { displayName: string; path: string }[]) {
        var m3uString = '#EXTM3U\r\n';
        m3uString += tracks.map((track) => `#EXTINF:-1, ${track.displayName.replaceAll('\n', '')}\r\n${track.path}`).join('\r\n');
        return m3uString;
    }
}
