import { InteropQuery } from '../client-interop/interop-query.js';
import { EntityStatusDialog } from '../dialogs/entity-status-dialog/entity-status-dialog.js';
import { MediaModel, ModelCreationState } from '../obscuritas-media-manager-backend-client.js';
import { MusicPlaylistPage } from '../pages/music-playlist-page/music-playlist-page.js';
import { MediaService, MusicService, PlaylistService } from './backend.services.js';
import { ClientInteropService } from './client-interop-service.js';
import { changePage, getPageName } from './extensions/url.extension.js';

export class MediaImportService {
    static async importAudioFiles() {
        /** @type {string[]} */ var filePaths = await ClientInteropService.executeQuery({
            query: InteropQuery.RequestFolderContent,
            payload: null,
        });
        if (!filePaths) return;

        var dialog = EntityStatusDialog.show((x) => x.entries.length == filePaths.length);

        /** @type {string[]} */ var affectedTrackHashs = [];
        for (let path of filePaths)
            MusicService.createMusicTrackFromPath(path).then((result) => {
                var name = path.split('\\').at(-1);
                dialog.addEntry({ text: name, status: result.value });
                if (result.value == ModelCreationState.Success || result.value == ModelCreationState.Updated)
                    affectedTrackHashs.push(result.key);
            });

        dialog.addEventListener('accept', async () => {
            dialog.remove();
            if (affectedTrackHashs.length <= 0) return;
            var playlistId = await PlaylistService.createTemporaryPlaylist(affectedTrackHashs);
            changePage(getPageName(MusicPlaylistPage), `?guid=${playlistId}`);
        });
    }

    static async importMediaCollections() {
        /** @type {string} */ var rootPath = await ClientInteropService.executeQuery({
            query: InteropQuery.RequestFolderPath,
            payload: null,
        });
        if (!rootPath) return;

        var complete = false;
        var dialog = EntityStatusDialog.show(() => complete);
        for await (const media of this.importRootFolder(rootPath))
            for (var entry of media.streamingEntries)
                dialog.addEntry({
                    text: `${media.name} - ${entry.season} Episode ${entry.episode}`,
                    status: ModelCreationState.Loading,
                });
    }

    /**
     * @param {string} rootPath
     * @returns {AsyncGenerator<MediaModel>}
     */
    static async *importRootFolder(rootPath) {
        // @ts-ignore
        MediaService.processImportRootFolder = (x) => x;
        var response = /** @type {Response} */ (/** @type {any} */ (await MediaService.importRootFolder(rootPath)));
        var decoder = new TextDecoder('utf-8');
        for await (let item of /** @type {any} */ (response.body)) {
            var text = decoder.decode(item);
            if (text.startsWith('[')) text = text.substring(1);
            if (text.startsWith(',')) text = text.substring(1);
            if (text.endsWith(']')) text = text.slice(0, -1);
            var result = JSON.parse('[' + text + ']');
            for (var res of result) yield res;
        }
    }

    /**
     * @param {Response} response
     */
    static async *fetchAndProcessData(response) {
        response.body.getReader({ mode: 'byob' });
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let data = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            // Decode the data and add it to our variable
            data += decoder.decode(value);

            // Process each complete JSON object
            let start = 0;
            let end = data.indexOf('\n');

            while (end !== -1) {
                // Parse the JSON object and yield it
                const jsonObject = JSON.parse(data.substring(start, end));
                yield jsonObject;

                // Move to the next JSON object
                start = end + 1;
                end = data.indexOf('\n', start);
            }

            // Keep any incomplete data for the next iteration
            data = data.substring(start);
        }
    }
}
