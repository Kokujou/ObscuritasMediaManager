import { html } from 'lit-element';
import { InteropQuery } from '../client-interop/interop-query';
import { EntityStatusDialog } from '../dialogs/entity-status-dialog/entity-status-dialog';
import { LinkElement } from '../native-components/link-element/link-element';
import { Language, MediaCategory, MediaCreationRequest, ModelCreationState } from '../obscuritas-media-manager-backend-client';
import { MediaDetailPage } from '../pages/media-detail-page/media-detail-page';
import { MusicPlaylistPage } from '../pages/music-playlist-page/music-playlist-page';
import { MediaService, MusicService, PlaylistService } from './backend.services';
import { ClientInteropService } from './client-interop-service';
import { changePage } from './extensions/url.extension';

export class MediaImportService {
    static async importAudioFiles() {
        const filePaths = await ClientInteropService.executeQuery<string[]>({
            query: InteropQuery.RequestFolderContent,
            payload: null,
        });
        if (!filePaths) return;

        var dialog = EntityStatusDialog.show((x) => x.entries.length == filePaths.length);

        var affectedTrackHashs: string[] = [];
        for (let path of filePaths) {
            var name = path.split('\\').at(-1);
            MusicService.createMusicTrackFromPath(path).then((result) => {
                dialog.addEntry({
                    text: result.key
                        ? LinkElement.forPage(MusicPlaylistPage, { trackHash: result.key }, name ?? path)
                        : name ?? path,
                    status: result.value,
                });
                if (result.value == ModelCreationState.Success || result.value == ModelCreationState.Updated)
                    affectedTrackHashs.push(result.key!);
            });
        }

        dialog.addEventListener('accept', async () => {
            dialog.remove();
            if (affectedTrackHashs.length <= 0) return;
            var playlistId = await PlaylistService.createTemporaryPlaylist(affectedTrackHashs)!;
            changePage(MusicPlaylistPage, { playlistId });
        });
    }

    static importMediaCollections(category: MediaCategory, language: Language) {
        return new Promise<void>(async (resolve) => {
            var mediaPaths = await ClientInteropService.executeQuery<string[]>({
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

    static async *fetchAndProcessData(response: Response) {
        response!.body!.getReader({ mode: 'byob' });
        const reader = response!.body!.getReader();
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
