import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import {
    ContentWarning,
    MediaModel,
    StreamingEntryModel,
    UpdateRequestOfMediaModel,
} from '../../obscuritas-media-manager-backend-client.js';
import { MediaService } from '../../services/backend.services.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
import { VideoPlayerPopup } from '../video-player-popup/video-player-popup.js';
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

    get seasons() {
        /** @type {string[]} */ var seasons = [];
        this.updatedMedia.streamingEntries.forEach((x) => {
            if (!seasons.includes(x.season)) seasons.push(x.season);
        });
        return seasons.sort((a, b) => a.localeCompare(b));
    }

    get episodes() {
        return this.updatedMedia.streamingEntries.filter((x) => x.season == this.seasons[this.selectedSeason]);
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

        /** @type {MediaModel} */ this.oldMedia = null;
        /** @type {MediaModel} */ this.updatedMedia = null;
        /** @type {string[]} */ this.mediaIds = [];
        this.hoveredRating = 0;
        this.selectedSeason = 0;
        this.editMode = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(
            Session.mediaList.subscribe((newList) => {
                var filter = MediaFilter.fromJSON(localStorage.getItem(`media.search`));
                this.mediaIds = MediaFilterService.filter([...newList], filter).map((x) => x.id);
            })
        );
    }

    render() {
        if (!this.updatedMedia) return;

        return renderMediaDetailPage(this);
    }

    /**
     * @param {Map<keyof MediaDetailPage, any>} _changedProperties
     */
    async updated(_changedProperties) {
        super.updated(_changedProperties);
        if (this.mediaId != this.updatedMedia?.id) {
            var media = await MediaService.get(this.mediaId);
            this.oldMedia = Object.assign(new MediaModel(), media);
            this.updatedMedia = Object.assign(new MediaModel(), media);

            this.requestFullUpdate();
            document.title = this.updatedMedia.name;
            setFavicon(this.updatedMedia.image, 'url');
        }
    }

    async showGenreSelectionDialog() {
        var genreDialog = await GenreDialog.startShowingWithGenres(this.updatedMedia.genres);
        genreDialog.addEventListener('accept', async (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            await this.changeProperty('genres', e.detail.acceptedGenres);
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
            var media = this.updatedMedia.clone();
            media[property] = value;
            await MediaService.updateMedia(media.id, new UpdateRequestOfMediaModel({ oldModel: this.oldMedia, newModel: media }));
            this.updatedMedia[property] = value;
            this.oldMedia[property] = value;
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

    /**
     * @param {string} imageData
     */
    async addImage(imageData) {
        try {
            await MediaService.addMediaImage(imageData, this.updatedMedia.id);
            this.updatedMedia.image = imageData;
            this.requestFullUpdate();
        } catch (err) {
            console.error(err);
        }
    }

    async deleteImage() {
        try {
            await MediaService.deleteMediaImage(this.updatedMedia.id);
            this.updatedMedia.image = null;
            this.requestFullUpdate();
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {StreamingEntryModel} entry
     */
    openVideoPlayer(entry) {
        VideoPlayerPopup.popup(entry);
    }
}
