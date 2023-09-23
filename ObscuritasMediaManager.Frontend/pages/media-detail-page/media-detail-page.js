import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter.js';
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    ContentWarning,
    GenreModel,
    MediaModel,
    StreamingEntryModel,
    UpdateRequestOfMediaModel,
} from '../../obscuritas-media-manager-backend-client.js';
import { GenreService, MediaService, StreamingService } from '../../services/backend.services.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
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

        /** @type {MediaModel} */ this.oldMedia = null;
        /** @type {MediaModel} */ this.updatedMedia = null;
        /** @type {StreamingEntryModel[]} */ this.streamingEntries = [];
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
            }),
            Session.currentPage.subscribe(() => this.getMediaFromRoute())
        );

        await this.getMediaFromRoute();

        setFavicon(this.updatedMedia.image, 'url');
    }

    async getMediaFromRoute() {
        var guid = getQueryValue('guid');
        if (!guid) return;
        var media = await MediaService.get(guid);
        this.oldMedia = Object.assign(new MediaModel(), media);
        this.updatedMedia = Object.assign(new MediaModel(), media);
        this.streamingEntries = await StreamingService.getStreamingEntries(guid);

        this.requestFullUpdate();
        document.title = this.updatedMedia.name;
    }

    render() {
        if (!this.updatedMedia) return;

        return renderMediaDetailPage(this);
    }

    async showGenreSelectionDialog() {
        var genres = await GenreService.getAll();
        var genreDialog = GenreDialog.show({
            genres,
            ignoredState: CheckboxState.Forbid,
            allowedGenres: genres.filter((x) => this.updatedMedia.genres.includes(x.name)),
            allowAdd: true,
            allowRemove: true,
        });

        genreDialog.addEventListener('decline', () => genreDialog.remove());
        genreDialog.addEventListener('accept', async (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            await this.changeProperty(
                'genres',
                e.detail.acceptedGenres.map((x) => x.name)
            );

            genreDialog.remove();
        });
        genreDialog.addEventListener(
            'add-genre',
            /** @param {CustomEvent<{name, section}>} e */ async (e) => {
                try {
                    await GenreService.addGenre(e.detail.section, e.detail.name);
                    genreDialog.options.genres = await GenreService.getAll();
                    genreDialog.requestFullUpdate();
                    MessageSnackbar.popup('Das Genre wurde erfolgreich hinzugefügt.', 'success');
                } catch (err) {
                    MessageSnackbar.popup('Ein Fehler ist beim hinzufügen des Genres aufgetreten: ' + err, 'error');
                    e.preventDefault();
                }
            }
        );
        genreDialog.addEventListener(
            'remove-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                try {
                    await GenreService.removeGenre(e.detail.id);
                    genreDialog.options.genres = await GenreService.getAll();
                    genreDialog.requestFullUpdate();
                    MessageSnackbar.popup('Das Genre wurde erfolgreich gelöscht.', 'success');
                } catch (err) {
                    MessageSnackbar.popup('Ein Fehler ist beim löschen des Genres aufgetreten: ' + err, 'error');
                    e.preventDefault();
                }
            }
        );
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
            await this.getMediaFromRoute();
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
