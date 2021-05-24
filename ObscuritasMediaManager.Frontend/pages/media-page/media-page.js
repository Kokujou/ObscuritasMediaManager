import { MediaSearchFilterData } from '../../advanced-components/media-search/media-search-filter.data.js';
import { MediaModel } from '../../data/media.model.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { StreamingEntryModel } from '../../data/streaming-entry.model.js';
import { LitElement } from '../../exports.js';
import { importFiles } from '../../services/extensions/file.extension.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
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
        return {
            mediaType: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {string} */ this.mediaType = '';

        /** @type {MediaSearchFilterData} */ this.filterData = new MediaSearchFilterData();
        /** @type {Subscription[]} */ this.subscriptions = [];
    }

    connectedCallback() {
        super.connectedCallback();

        var localSearchString = localStorage.getItem(`${this.mediaType}.search`);
        if (localSearchString) this.filterData = JSON.parse(localSearchString);

        this.subscriptions.push(session.mediaList.subscribe(() => this.requestUpdate(undefined)));
    }

    /**
     * @param {Map<any, any>} [_changedProperties]
     */
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }

    get mediaList() {
        return session.mediaList.current().filter((x) => x.type == this.mediaType) || [];
    }

    render(content) {
        return renderMediaPageTemplate(this, content);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MediaPage.processFiles(fileImportResult.files, fileImportResult.basePath, this.mediaType);
        } catch {
            console.info('the import of files was aborted');
        }
    }

    /**
     * @param {FileList} files
     * @param {string} basePath
     * @param {string} mediaType
     */
    static async processFiles(files, basePath, mediaType) {
        var media = [];
        var streamingEntries = [];
        var episode = 0;
        for (var i = 0; i < files.length; i++) {
            try {
                var streamingEntry = StreamingEntryModel.fromFile(files[i], mediaType, basePath);
                if (streamingEntries.some((x) => x.name == streamingEntry.name && x.season == streamingEntry.season)) episode += 1;
                else episode = 1;
                streamingEntry.episode = episode;

                streamingEntries.push(streamingEntry);

                if (media.some((x) => x.name == streamingEntry.name)) continue;
                media.push(new MediaModel(streamingEntry.name, mediaType));
            } catch (err) {
                continue;
            }
        }

        try {
            await MediaService.batchCreateMedia(media);
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
     * @param {string} imageData
     */
    async addImageFor(media, imageData) {
        try {
            await MediaService.addImageForMedia(media.id, imageData);
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
            var media = new MediaModel(media.name, media.type);
            media.rating = newRating;
            await MediaService.updateMedia(media.id, media);
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
            var media = new MediaModel(media.name, media.type);
            media.genreString = genres.join(',');
            await MediaService.updateMedia(media.id, media);
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
        this.filterData = filterData;
        this.requestUpdate(undefined);
    }

    get filteredMedia() {
        if (!this.filterData) return this.mediaList;

        var result = MediaFilterService.applyRatingFilter(this.filterData.ratingFilter, this.mediaList);
        result = MediaFilterService.applyGenreFilter(this.filterData.genreFilter, result);
        result = MediaFilterService.applyTextFilter(this.filterData.searchText || '', result);
        return result;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        localStorage.setItem(`${this.mediaType}.search`, JSON.stringify(this.filterData));
    }
}
