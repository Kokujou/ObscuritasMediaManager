import { Session } from '../data/session.js';
import { MediaModel, StreamingEntryModel } from '../obscuritas-media-manager-backend-client.js';
import { MediaService, StreamingService } from './backend.services.js';
import { newGuid } from './extensions/crypto.extensions.js';
import { analyzeMediaFile } from './extensions/file.extension.js';

export class MediaFileservice {
    /**
     * @param {File[]} files
     * @param {string} basePath
     */
    static async process(files, basePath) {
        var newMedia = [];
        var streamingEntries = [];
        var episode = 0;
        for (var i = 0; i < files.length; i++) {
            try {
                var mediaFileInfo = analyzeMediaFile(files[i], basePath);
                var associatedMedia = Session.mediaList.current().find((x) => x.name == mediaFileInfo.name);

                if (!associatedMedia) {
                    associatedMedia = new MediaModel(
                        Object.assign(new MediaModel(), { name: mediaFileInfo.name, id: newGuid() })
                    );
                    newMedia.push(associatedMedia);
                }

                var streamingEntry = new StreamingEntryModel({
                    id: associatedMedia.id,
                    season: mediaFileInfo.season,
                    src: mediaFileInfo.src,
                    episode: 0,
                });
                if (streamingEntries.some((x) => associatedMedia.id == streamingEntry.id && x.season == streamingEntry.season))
                    episode += 1;
                else episode = 1;
                streamingEntry.episode = episode;

                streamingEntries.push(streamingEntry);
            } catch (err) {
                continue;
            }
        }

        try {
            await MediaService.batchCreateMedia(newMedia);
        } catch (err) {
            console.error(err);
        }

        try {
            await StreamingService.batchPostStreamingEntries(streamingEntries);
            location.reload();
        } catch (err) {
            console.error(err);
        }
    }
}
