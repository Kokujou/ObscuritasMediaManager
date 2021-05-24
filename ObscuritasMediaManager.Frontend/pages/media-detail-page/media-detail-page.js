import { MediaModel } from '../../data/media.model.js';
import { StreamingEntryModel } from '../../data/streaming-entry.model.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { LitElement } from '../../exports.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { GenreService } from '../../services/genre.service.js';
import { MediaService } from '../../services/media.service.js';
import { StreamingService } from '../../services/streaming.service.js';
import { VideoPlayerPopup } from '../video-player-popup/video-player-popup.js';
import { renderMediaDetailPageStyles } from './media-detail-page.css.js';
import { renderMediaDetailPage } from './media-detail-page.html.js';

export class MediaDetailPage extends LitElement {
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
        this.media = await MediaService.getMedia(guid);
        this.streamingEntries = await StreamingService.getStreamingEntries(guid);
        console.log(this.streamingEntries);

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
        var genres = await GenreService.getGenreList();
        var genreDialog = GenreDialog.show(
            genres,
            genres.filter((x) => this.media.genres.includes(x.name)),
            [],
            false
        );

        genreDialog.addEventListener('decline', () => genreDialog.remove());
        genreDialog.addEventListener('accept', async (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            try {
                var media = new MediaModel(this.media.name, this.media.type);
                media.genreString = e.detail.acceptedGenres.map((x) => x.name).join(',');
                await MediaService.updateMedia(media.id, media);
                this.media.genreString = media.genreString;
                this.requestUpdate(undefined);
                genreDialog.remove();
            } catch (err) {
                console.error(err);
            }
        });
    }

    async removeGenre(genre) {
        try {
            var media = new MediaModel(this.media.name, this.media.type);
            media.genreString = this.media.genres.filter((x) => x != genre).join(',');
            await MediaService.updateMedia(media.id, media);
            this.media.genreString = media.genreString;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {number} newRating
     */
    async changeRating(newRating) {
        try {
            var media = new MediaModel(this.media.name, this.media.type);
            media.rating = newRating;
            await MediaService.updateMedia(media.id, media);
            this.media.rating = newRating;
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
            await MediaService.addImageForMedia(this.media.id, imageData);
            this.media.image = imageData;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    async deleteImage() {
        try {
            await MediaService.removeImageForMedia(this.media.id);
            this.media.image = null;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    async changeName() {
        try {
            /** @type {HTMLInputElement} */ var nameInput = this.shadowRoot.querySelector('#media-name');
            var media = new MediaModel();
            media.name = nameInput.value;

            await MediaService.updateMedia(this.media.id, media);
            this.media.name = media.name;
            this.requestUpdate(undefined);
        } catch (err) {
            console.error(err);
        }
    }

    async changeDescription() {
        try {
            /** @type {HTMLTextAreaElement} */ var descriptionInput = this.shadowRoot.querySelector('#description-input');
            var description = descriptionInput.value;
            var media = new MediaModel(this.media.name, this.media.type);
            media.description = description;
            await MediaService.updateMedia(media.id, media);
            this.media.description = media.description;
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
