import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter.js';
import { InteropQuery } from '../../client-interop/interop-query.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    ContentWarning,
    MediaCategory,
    MediaCreationRequest,
    MediaGenreModel,
    MediaModel,
    ModelCreationState,
    UpdateRequestOfJsonElement,
} from '../../obscuritas-media-manager-backend-client.js';
import { MediaService } from '../../services/backend.services.js';
import { ClientInteropService } from '../../services/client-interop-service.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
import { renderMediaDetailPageStyles } from './media-detail-page.css.js';
import { renderMediaDetailPage } from './media-detail-page.html.js';

export class MediaDetailPage extends LitElementBase {
    static get isPage() {
        return true;
    }

    static get styles() {
        return renderMediaDetailPageStyles();
    }

    static get properties() {
        return {
            editMode: { type: Boolean, reflect: true },

            newGenre: { type: Boolean, reflect: false },
            hoveredRating: { type: Number, reflect: false },
            selectedSeason: { type: Number, reflect: false },
        };
    }

    get nameInputValue() {
        return /** @type {HTMLInputElement} */ (this.shadowRoot.querySelector('#media-name')).value;
    }

    get descriptionInputValue() {
        return /** @type {HTMLInputElement} */ (this.shadowRoot.querySelector('#description-input')).value;
    }

    /** @returns {HTMLElement} */
    get seasonScrollContainer() {
        var element = this.shadowRoot.getElementById('season-inner');

        if (element) return element;
        return undefined;
    }

    get nextMediaId() {
        var currentIndex = this.mediaIds.findIndex((x) => x == this.updatedMedia.id);
        return this.mediaIds[currentIndex + 1];
    }

    get prevMediaId() {
        var currentIndex = this.mediaIds.findIndex((x) => x == this.updatedMedia.id);
        return this.mediaIds[currentIndex - 1];
    }

    constructor() {
        super();

        /** @type {string} */ this.mediaId = null;
        /** @type {MediaModel} */ this.updatedMedia = new MediaModel();
        /** @type {string[]} */ this.mediaIds = [];
        /** @type {boolean} */ this.createNew = false;
        this.hoveredRating = 0;
        this.selectedSeason = 0;
        this.editMode = false;
    }

    async connectedCallback() {
        this.updatedMedia = await MediaService.getDefault();

        super.connectedCallback();
        this.subscriptions.push(
            Session.mediaList.subscribe((newList) => {
                var filter = MediaFilter.fromJSON(localStorage.getItem(`media.search`));
                this.mediaIds = MediaFilterService.filter([...newList], filter).map((x) => x.id);
            })
        );
        Session.mediaList.refresh();
    }

    render() {
        if (!this.updatedMedia) return;

        document.title = this.updatedMedia.name;

        return renderMediaDetailPage(this);
    }

    /**
     * @param {Map<keyof MediaDetailPage, any>} _changedProperties
     */
    async updated(_changedProperties) {
        super.updated(_changedProperties);
        if (this.mediaId != this.updatedMedia?.id && !this.createNew) {
            var media = await MediaService.get(this.mediaId);
            this.updatedMedia = Object.assign(new MediaModel(), media);

            this.requestFullUpdate();
            document.title = this.updatedMedia.name;
            setFavicon(this.updatedMedia.image, 'url');
        }
    }

    async showGenreSelectionDialog() {
        var genreDialog = await GenreDialog.startShowingWithGenres(this.updatedMedia.genres);

        genreDialog.addEventListener('accept', async (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            await this.changeProperty('genres', /** @type {MediaGenreModel[]} */ (e.detail.acceptedGenres));
            genreDialog.remove();
        });
    }

    /**
     * @template {keyof MediaModel} T
     * @param {T} property
     * @param {MediaModel[T]} value
     */
    async changeProperty(property, value) {
        try {
            /** @type {any} */ const { oldModel, newModel } = { oldModel: {}, newModel: {} };
            oldModel[property] = this.updatedMedia[property];
            newModel[property] = value;

            if (!this.createNew) {
                await MediaService.updateMedia(this.updatedMedia.id, new UpdateRequestOfJsonElement({ oldModel, newModel }));
                Session.mediaList.current().find((x) => x.id == this.updatedMedia.id)[property] = value;
                Session.mediaList.refresh();
            }

            this.updatedMedia[property] = value;
            this.requestFullUpdate();
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {HTMLInputElement} inputElement
     */
    async releaseChanged(inputElement) {
        var numberValue = Number.parseInt(inputElement.value);
        var maxYears = new Date().getFullYear() + 2;
        if (numberValue < 1900) numberValue = 1900;
        if (numberValue > maxYears) numberValue = maxYears;
        if (`${numberValue}` != inputElement.value) inputElement.value = `${numberValue}`;
        await this.changeProperty('release', numberValue);
    }

    /**
     * @param {HTMLInputElement} inputElement
     */
    releaseInput(inputElement) {
        var numberValue = Number.parseInt(inputElement.value);
        if (`${numberValue}` != inputElement.value) inputElement.value = `${numberValue}`;
    }

    /**
     * @param {ContentWarning} warning
     */
    async toggleContentWarning(warning) {
        if (!this.updatedMedia.contentWarnings.includes(warning))
            return await this.changeProperty('contentWarnings', this.updatedMedia.contentWarnings.concat(warning));

        return await this.changeProperty(
            'contentWarnings',
            this.updatedMedia.contentWarnings.filter((x) => x != warning)
        );
    }

    async changeBasePath() {
        var folderPath = await ClientInteropService.executeQuery({ query: InteropQuery.RequestFolderPath, payload: null });
        if (!folderPath) return;
        await this.changeProperty('rootFolderPath', folderPath);
    }

    async createEntry() {
        try {
            if (!this.updatedMedia.rootFolderPath) throw new Error('The folder path must be valid.');
            var result = await MediaService.createFromMediaPath(
                new MediaCreationRequest({
                    category: this.updatedMedia.type,
                    entry: this.updatedMedia,
                    language: this.updatedMedia.language,
                    rootPath: this.updatedMedia.rootFolderPath,
                })
            );
            if (result.value != ModelCreationState.Success) throw new Error(result.value);
            await MessageSnackbar.popup('Der Eintrag wurde erfolgreich erstellt.', 'success');
            Session.mediaList.current().push(this.updatedMedia);
            Session.mediaList.refresh();
            changePage(MediaDetailPage, { mediaId: result.key });
        } catch (err) {
            await MessageSnackbar.popup('Ein Fehler ist beim erstellen des Eintrags aufgetreten: ' + err, 'error');
        }
    }

    openMediaExternal() {
        if (this.updatedMedia.type == MediaCategory.AnimeSeries || this.updatedMedia.type == MediaCategory.AnimeMovies)
            window.open(`https://anilist.co/search/anime?search=${this.updatedMedia.name}`);
        else window.open(`https://www.imdb.com/find/?q=${this.updatedMedia.name}&ref_=nv_sr_sm`);
    }
}
