import { MediaSearchFilterData } from '../../advanced-components/media-search/media-search-filter.data.js';
import { MediaModel } from '../../data/media.model.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { StreamingEntryModel } from '../../data/streaming-entry.model.js';
import { MessageDialog } from '../../dialogs/message-dialog/message-dialog.js';
import { PathInputDialog } from '../../dialogs/path-input-dialog/path-input-dialog.js';
import { LitElement } from '../../exports.js';
import { FileService } from '../../services/file.service.js';
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

        /** @type {MediaSearchFilterData} */ this.filterData = new MediaSearchFilterData();
        /** @type {Subscription[]} */ this.subscriptions = [];
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(session.mediaList.subscribe(() => this.requestUpdate(undefined)));
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }

    get mediaList() {
        return session.mediaList.current() || [];
    }

    render(content) {
        return renderMediaPageTemplate(this, content);
    }

    importFolder() {
        const type = 'AnimesGerSub';
        /** @type {HTMLInputElement} */ var folderInput = this.shadowRoot.querySelector('#folder-browser');
        folderInput.click();
        folderInput.addEventListener('change', (e) => {
            var pathDialog = PathInputDialog.show();
            pathDialog.addEventListener('accept', async (e) => {
                /** @type {string} */ var basePath = e.detail.path;
                var files = folderInput.files;

                var fileSources = [];
                var basePath = basePath.substring(0, basePath.lastIndexOf('\\'));
                for (var i = 0; i < folderInput.files.length; i++) {
                    // @ts-ignore
                    fileSources.push(`${basePath}\\${folderInput.files[i].webkitRelativePath}`.replaceAll('/', '\\'));
                }

                if (!(await FileService.validate(fileSources))) {
                    var messageDialog = MessageDialog.show(
                        'Ungültiger Basispfad!',
                        'Die Dateien konnten mit dem eingegebenen Basispfad nicht zurückverfolgt werden!'
                    );
                    messageDialog.addDefaultEventListeners();
                } else {
                    pathDialog.remove();
                    await MediaPage.processFiles(files, basePath);
                }
            });

            pathDialog.addEventListener('decline', () => pathDialog.close());
        });
    }

    /**
     * @param {FileList} files
     */
    static async processFiles(files, basePath) {
        var animes = [];
        var streamingEntries = [];
        var episode = 0;
        for (var i = 0; i < files.length; i++) {
            try {
                var streamingEntry = StreamingEntryModel.fromFile(files[i], 'AnimesGerSub', basePath);
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

        try {
            await MediaService.batchCreateMedia(animes);
        } catch (err) {
            console.error(err);
        }

        try {
            await StreamingService.BatchCreateStreamingEntries(streamingEntries);
            location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {MediaModel} media
     */
    async addImageFor(media, imageData) {
        try {
            await MediaService.addImageForMedia(media.name, media.type, imageData);
            media.image = imageData;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {MediaModel} media
     * @param {number} newRating
     */
    async updateRating(media, newRating) {
        try {
            var model = new MediaModel(media.name, media.type);
            model.rating = newRating;
            await MediaService.updateMedia(model);
            media.rating = newRating;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {MediaModel} media
     * @param {string[]} genres
     */
    async updateGenres(media, genres) {
        try {
            var model = new MediaModel(media.name, media.type);
            model.genreString = genres.join(',');
            await MediaService.updateMedia(model);
            media.genreString = genres.join(',');
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {MediaSearchFilterData} filterData
     */
    updateSearchFilter(filterData) {
        console.log(filterData);
        this.filterData = filterData;
        this.requestUpdate(undefined);
    }

    get filteredMedia() {
        return this.mediaList.filter(
            (media) =>
                this.filterData.ratingFilter.includes(media.rating) &&
                this.filterData.genreFilter.acceptedGenres.every((genre) => media.genres.includes(genre.name)) &&
                media.genres.every((genre) => this.filterData.genreFilter.forbiddenGenres.every((x) => x.name != genre))
        );
    }
}
