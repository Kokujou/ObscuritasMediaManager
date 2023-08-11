import { MediaSearchFilter } from '../../advanced-components/media-search/media-search-filter.data.js';
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { MediaModel, StreamingEntryModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreService, MediaService, StreamingService } from '../../services/backend.services.js';
import { newGuid } from '../../services/extensions/crypto.extensions.js';
import { analyzeMediaFile, importFiles } from '../../services/extensions/file.extension.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
import { ObjectFilterService } from '../../services/object-filter.service.js';
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

export class MediaPage extends LitElementBase {
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

        /** @type {MediaSearchFilter} */ this.filter = new MediaSearchFilter();
        /** @type {Subscription[]} */ this.subscriptions = [];
        /** @type {string[]} */ this.genreList = [];
    }

    async connectedCallback() {
        super.connectedCallback();

        this.genreList = (await GenreService.getAll()).map((x) => x.name);

        var localSearchString = localStorage.getItem(`${this.mediaType}.search`);
        if (localSearchString) this.filter = JSON.parse(localSearchString);

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

    render() {
        return renderMediaPageTemplate(this);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MediaPage.processFiles(fileImportResult.files, fileImportResult.basePath, this.mediaType);
        } catch (err) {
            console.error('the import of files was aborted', err);
        }
    }

    /**
     * @param {File[]} files
     * @param {string} basePath
     * @param {string} mediaType
     */
    static async processFiles(files, basePath, mediaType) {
        var newMedia = [];
        var streamingEntries = [];
        var episode = 0;
        for (var i = 0; i < files.length; i++) {
            try {
                var mediaFileInfo = analyzeMediaFile(files[i], basePath);
                var associatedMedia = session.mediaList.current().find((x) => x.name == mediaFileInfo.name);

                if (!associatedMedia) {
                    associatedMedia = new MediaModel(
                        Object.assign(new MediaModel(), { name: mediaFileInfo.name, type: mediaType, id: newGuid() })
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

    /**
     * @param {MediaModel} media
     * @param {string} imageData
     */
    async addImageFor(media, imageData) {
        try {
            await MediaService.addMediaImage(imageData, media.id);
            media.image = imageData;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {MediaModel} media
     * @param {keyof MediaModel} property
     * @param {any} value
     */
    async changePropertyOf(media, property, value) {
        try {
            if (typeof media[property] != typeof value) return;

            /** @type {any} */ (media[property]) = value;
            await MediaService.updateMedia(media);
            /** @type {any} */ (media[property]) = value;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }
    /**
     * @param {MediaSearchFilter} filterData
     */
    updateSearchFilter(filterData) {
        this.filter = filterData;
        this.requestUpdate(undefined);
    }

    get filteredMedia() {
        if (!this.filter) return this.mediaList;

        var result = [...this.mediaList];
        ObjectFilterService.applyPropertyFilter(result, new FilterEntry(this.filter.ratings, CheckboxState.Allow), 'rating');
        ObjectFilterService.applyArrayFilter(result, this.filter.genres, 'genres');
        MediaFilterService.applyTextFilter(this.filter.search || '', result);
        return result;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        localStorage.setItem(`${this.mediaType}.search`, JSON.stringify(this.filter));
    }
}
