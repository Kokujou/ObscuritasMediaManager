import { InteropQuery } from '../client-interop/interop-query.js';
import { EntityStatusDialog } from '../dialogs/entity-status-dialog/entity-status-dialog.js';
import { html } from '../exports.js';
import { LinkElement } from '../native-components/link-element/link-element.js';
import { Language, MediaCategory, MediaCreationRequest, ModelCreationState } from '../obscuritas-media-manager-backend-client.js';
import { MediaDetailPage } from '../pages/media-detail-page/media-detail-page.js';
import { MusicPlaylistPage } from '../pages/music-playlist-page/music-playlist-page.js';
import { MediaService, MusicService, PlaylistService } from './backend.services.js';
import { ClientInteropService } from './client-interop-service.js';
import { changePage } from './extensions/url.extension.js';

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
                dialog.addEntry({
                    text: LinkElement.forPage(MusicPlaylistPage, { trackHash: result.key }, name),
                    status: result.value,
                });
                if (result.value == ModelCreationState.Success || result.value == ModelCreationState.Updated)
                    affectedTrackHashs.push(result.key);
            });

        dialog.addEventListener('accept', async () => {
            dialog.remove();
            if (affectedTrackHashs.length <= 0) return;
            var playlistId = await PlaylistService.createTemporaryPlaylist(affectedTrackHashs);
            changePage(MusicPlaylistPage, { playlistId });
        });
    }

    /**
     *
     * @param {MediaCategory} category
     * @param {Language} language
     */
    static importMediaCollections(category, language) {
        return new Promise(async (resolve) => {
            /** @type {string[]} */ var mediaPaths = await ClientInteropService.executeQuery({
                query: InteropQuery.RequestSubFolders,
                payload: null,
            });
            if (!mediaPaths) return;

            var complete = false;
            var dialog = EntityStatusDialog.show(() => complete);

            for (const path of mediaPaths) {
                var response = await MediaService.createFromMediaPath(
                    new MediaCreationRequest({ rootPath: path, category, language })
                );

                if (!response.key) {
                    var mediaName = path.split('\\').at(-1);
                    dialog.addEntry({
                        text: html`<link-element tooltip="${path}">${mediaName}</link-element>`,
                        status: response.value,
                    });
                    continue;
                }

                var media = await MediaService.get(response.key);
                dialog.addEntry({
                    text: LinkElement.forPage(MediaDetailPage, { mediaId: response.key }, media.name),
                    status: response.value,
                });
            }

            complete = true;
            dialog.requestFullUpdate();

            dialog.addEventListener('accept', () => {
                dialog.remove();
                resolve();
            });
        });
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
