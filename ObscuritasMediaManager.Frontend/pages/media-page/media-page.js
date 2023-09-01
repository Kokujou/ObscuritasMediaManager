import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { MediaModel, UpdateRequestOfMediaModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreService, MediaService } from '../../services/backend.services.js';
import { importFiles } from '../../services/extensions/file.extension.js';
import { MediaFileservice } from '../../services/media-file.service.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
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

    static get isPage() {
        return true;
    }

    static get pageName() {
        return 'Filme & Serien';
    }

    get filteredMedia() {
        if (!this.filter) return session.mediaList.current();

        return MediaFilterService.filter([...session.mediaList.current()], this.filter);
    }

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];
        /** @type {string[]} */ this.genreList = [];
        this.loading = true;
    }

    async connectedCallback() {
        super.connectedCallback();
        var genres = await GenreService.getAll();
        this.genreList = genres.map((x) => x.name);
        this.filter = new MediaFilter(genres.map((x) => x.id));

        var localSearchString = localStorage.getItem(`media.search`);
        if (localSearchString) this.filter = MediaFilter.fromJSON(localSearchString);

        this.subscriptions.push(session.mediaList.subscribe(() => this.requestUpdate(undefined)));

        this.loading = false;
        this.requestUpdate(undefined);
    }

    /**
     * @param {Map<any, any>} [_changedProperties]
     */
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }

    get paginatedMedia() {
        return session.mediaList;
    }

    render() {
        return renderMediaPageTemplate(this);
    }

    async importFolder() {
        try {
            var fileImportResult = await importFiles();
            await MediaFileservice.process(fileImportResult.files, fileImportResult.basePath);
        } catch (err) {
            console.error('the import of files was aborted', err);
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
     * @template {keyof MediaModel} T
     * @param {MediaModel} media
     * @param {T} property
     * @param {MediaModel[T]} value
     */
    async changePropertyOf(media, property, value) {
        try {
            if (typeof media[property] != typeof value) return;

            media[property] = value;
            await MediaService.updateMedia(media.id, new UpdateRequestOfMediaModel({ oldModel: null, newModel: media }));
            media[property] = value;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }
}
