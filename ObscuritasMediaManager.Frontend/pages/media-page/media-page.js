import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { MediaModel, UpdateRequestOfJsonElement } from '../../obscuritas-media-manager-backend-client.js';
import { GenreService, MediaService } from '../../services/backend.services.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
import { MediaImportService } from '../../services/media-import.service.js';
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
        if (!this.filter) return Session.mediaList.current();

        return MediaFilterService.filter([...Session.mediaList.current()], this.filter);
    }

    constructor() {
        super();

        /** @type {string[]} */ this.genreList = [];
        this.loading = true;
    }

    async connectedCallback() {
        super.connectedCallback();
        document.title = 'Medien';
        var genres = await GenreService.getAll();
        this.genreList = genres.map((x) => x.name);
        this.filter = new MediaFilter(genres.map((x) => x.id));

        var localSearchString = localStorage.getItem(`media.search`);
        if (localSearchString) this.filter = MediaFilter.fromJSON(localSearchString);

        this.subscriptions.push(Session.mediaList.subscribe(() => this.requestFullUpdate()));

        this.loading = false;
        this.requestFullUpdate();
    }

    /**
     * @param {Map<any, any>} [_changedProperties]
     */
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
    }

    get paginatedMedia() {
        return Session.mediaList;
    }

    render() {
        return renderMediaPageTemplate(this);
    }

    async importFolder() {
        try {
            await MediaImportService.importMediaCollections();
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
            this.requestFullUpdate();
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

            /** @type {any} */ const { oldModel, newModel } = { oldModel: {}, newModel: {} };
            oldModel[property] = media[property];
            newModel[property] = value;
            await MediaService.updateMedia(media.id, new UpdateRequestOfJsonElement({ oldModel, newModel }));
            media[property] = value;
            this.requestFullUpdate();
        } catch (err) {
            console.error(err);
        }
    }
}
