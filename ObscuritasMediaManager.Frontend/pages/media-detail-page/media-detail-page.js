import { LitElementBase } from '../../data/lit-element-base.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { MediaModel, StreamingEntryModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreService, MediaService, StreamingService } from '../../services/backend.services.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { VideoPlayerPopup } from '../video-player-popup/video-player-popup.js';
import { renderMediaDetailPageStyles } from './media-detail-page.css.js';
import { renderMediaDetailPage } from './media-detail-page.html.js';

export class MediaDetailPage extends LitElementBase {
    static get styles() {
        return renderMediaDetailPageStyles();
    }

    static get properties() {
        return {
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

    constructor() {
        super();

        this.media = new MediaModel();
        /** @type {StreamingEntryModel[]} */ this.streamingEntries = [];
        this.newGenre = false;
        this.hoveredRating = 0;
        this.selectedSeason = 0;
    }

    connectedCallback() {
        super.connectedCallback();

        this.getMediaFromRoute();
    }

    async getMediaFromRoute() {
        var guid = getQueryValue('guid');
        this.media = await MediaService.get(guid);
        this.streamingEntries = await StreamingService.getStreamingEntries(guid);

        this.requestUpdate(undefined);
        document.title = this.media.name;
    }

    get seasons() {
        /** @type {string[]} */ var seasons = [];
        this.streamingEntries.forEach((x) => {
            if (!seasons.includes(x.season)) seasons.push(x.season);
        });
        return seasons.sort((a, b) => a.localeCompare(b));
    }

    get episodes() {
        return this.streamingEntries.filter((x) => x.season == this.seasons[this.selectedSeason]);
    }

    /** @returns {HTMLElement} */
    get seasonScrollContainer() {
        var element = this.shadowRoot.getElementById('season-inner');

        if (element) return element;
        return undefined;
    }

    render() {
        if (!this.media) return;

        return renderMediaDetailPage(this);
    }

    /**
     * @param {HTMLElement} element
     */
    enableEditingFor(element) {
        /** @type {HTMLInputElement} */ var propertyValueInput = element.parentElement.querySelector('.property-value');
        propertyValueInput.removeAttribute('disabled');
        propertyValueInput.setAttribute('contenteditable', '');
        this.requestUpdate(undefined);
    }

    async showGenreSelectionDialog() {
        var genres = await GenreService.getAll();
        var genreDialog = GenreDialog.show(
            genres,
            genres.filter((x) => this.media.genres.includes(x.name)),
            [],
            false
        );

        genreDialog.addEventListener('decline', () => genreDialog.remove());
        genreDialog.addEventListener('accept', async (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            await this.changeProperty(
                'genres',
                e.detail.acceptedGenres.map((x) => x.name)
            );

            genreDialog.remove();
        });
    }

    /**
     * @param {keyof MediaModel} property
     * @param {typeof this.media[property]} value
     */
    async changeProperty(property, value) {
        try {
            if (typeof this.media[property] != typeof value) return;

            var media = this.media.clone();
            /** @type {any} */ (media[property]) = value;
            await MediaService.updateMedia(media);
            /** @type {any} */ (this.media[property]) = value;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {string} imageData
     */
    async addImage(imageData) {
        try {
            await MediaService.addMediaImage(this.media.id, imageData);
            this.media.image = imageData;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    async deleteImage() {
        try {
            await MediaService.deleteMediaImage(this.media.id);
            this.media.image = null;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    handleKeyPress(event) {
        if (!(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement))
            throw new Error('this function only intended for input elements!');

        var test = event.target;
        if (event.key == 'Escape') {
            test.value = test.defaultValue;
            test.setAttribute('disabled', 'true');
        }
        if (event.key == 'Enter' && !(event.target instanceof HTMLTextAreaElement)) {
            test.blur();
            test.setAttribute('disabled', 'true');
        }
    }

    /**
     * @param {StreamingEntryModel} entry
     */
    openVideoPlayer(entry) {
        VideoPlayerPopup.popup(entry);
    }
}
