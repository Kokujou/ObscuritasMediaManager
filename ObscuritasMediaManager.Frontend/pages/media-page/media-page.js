import { MediaModel } from '../../data/media.model.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { StreamingEntryModel } from '../../data/streaming-entry.model.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { LitElement } from '../../exports.js';
import { MediaService } from '../../services/media.service.js';
import { StreamingService } from '../../services/streaming.service.js';
import { renderMediaPageStyles } from './media-page.css.js';
import { renderMediaPageTemplate } from './media-page.html.js';

/*
    General filters:
    - Rating: Double Slider - sticked to int
    - Genre: popup, Multiselect, each select can be include/exclude/ignore
    - Tags: popup, Multiselect, each select can be include/exclude/ignore (could be mixed with genre)
    - Episode Count: number select left - right
    - Release: number select left - right
*/

export class MediaPage extends LitElement {
    static get styles() {
        return renderMediaPageStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();

        this.searchText = '';
        this.ratingFilter = [1, 2, 3, 4, 5];
        this.episodeCountFilter = { left: 0, right: 0 };
        this.genreFilter = new GenreDialogResult();
        /** @type {Subscription[]} */ this.subscriptions = [];
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(session.mediaList.subscribe(() => this.requestUpdate(undefined)));
    }

    get mediaList() {
        console.log(session.mediaList.current());
        return session.mediaList.current() || [];
    }

    render(content) {
        return renderMediaPageTemplate(this, content);
    }

    importFolder() {
        const type = 'AnimesGerSub';
        /** @type {HTMLInputElement} */ var folderInput = this.shadowRoot.querySelector('#folder-browser');
        folderInput.click();
        folderInput.addEventListener('change', async (e) => {
            var animes = [];
            var streamingEntries = [];
            var episode = 0;
            for (var i = 0; i < folderInput.files.length; i++) {
                try {
                    var streamingEntry = StreamingEntryModel.fromFile(folderInput.files[i], type);
                    if (streamingEntries.some((x) => x.name == streamingEntry.name && x.season == streamingEntry.season)) episode += 1;
                    else episode = 1;
                    streamingEntry.episode = episode;

                    streamingEntries.push(streamingEntry);

                    if (animes.some((x) => x.name == streamingEntry.name)) continue;
                    animes.push(new MediaModel(streamingEntry.name, 'AnimesGerSub'));
                } catch (err) {
                    continue;
                }
            }

            await MediaService.batchCreateMedia(animes);
            await StreamingService.BatchCreateStreamingEntries(streamingEntries);
            //call backend both arrays
        });
    }

    /**
     * @param {MediaModel} media
     */
    addImageFor(media) {
        /** @type {HTMLInputElement} */ var imageBrowser = this.shadowRoot.querySelector('#image-browser');
        imageBrowser.click();
        imageBrowser.addEventListener('change', async () => {
            var selectedImage = imageBrowser.files[0];

            var fileReader = new FileReader();
            fileReader.onload = async (fileData) => {
                var image = fileData.target.result;
                if (image instanceof ArrayBuffer) throw 'the string must be an base64 image string';

                try {
                    await MediaService.addImageForMedia(media, image);
                } catch (err) {
                    console.error(err);
                }
            };

            fileReader.readAsDataURL(imageBrowser.files[0]);
        });
    }
}
