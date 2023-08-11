import { LitElementBase } from '../../data/lit-element-base.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { GenreService } from '../../services/backend.services.js';
import { MediaSearchFilter } from './media-search-filter.data.js';
import { renderMediaSearchStyles } from './media-search.css.js';
import { renderMediaSearch } from './media-search.html.js';

export class MediaSearch extends LitElementBase {
    static get styles() {
        return renderMediaSearchStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        this.filter = new MediaSearchFilter();
    }

    render() {
        return renderMediaSearch(this);
    }

    toggleRating(rating) {
        if (this.ratingFilter.includes(rating)) this.ratingFilter = this.ratingFilter.filter((x) => x != rating);
        else this.ratingFilter.push(rating);
        this.notifyFilterUpdated();
    }

    getRatingClass(rating) {
        if (this.ratingFilter.includes(rating)) return 'selected';
        else return '';
    }

    updateEpisodeFilter() {
        /** @type {HTMLInputElement}*/ var leftEpisodeCountInput = this.shadowRoot.querySelector('#left-episode-count');
        /** @type {HTMLInputElement}*/ var rightEpisodeCountInput = this.shadowRoot.querySelector('#right-episode-count');
        var leftValue = Number.parseInt(leftEpisodeCountInput.value) || 0;
        var rightValue = Number.parseInt(rightEpisodeCountInput.value) || 0;
        if (leftValue >= rightValue) {
            leftEpisodeCountInput.setCustomValidity('Ungültige Episoden-Spanne');
            rightEpisodeCountInput.setCustomValidity('Ungültige Episoden-Spanne');
            return;
        }

        this.episodeCountFilter.left = leftValue;
        this.episodeCountFilter.right = rightValue;
        leftEpisodeCountInput.setCustomValidity('');
        rightEpisodeCountInput.setCustomValidity('');
        this.notifyFilterUpdated();
    }

    udpateReleaseDateFilter() {
        /** @type {HTMLInputElement}*/ var leftEpisodeCountInput = this.shadowRoot.querySelector('#left-release-date');
        /** @type {HTMLInputElement}*/ var rightEpisodeCountInput = this.shadowRoot.querySelector('#right-release-date');
        var leftValue = Number.parseInt(leftEpisodeCountInput.value) || 0;
        var rightValue = Number.parseInt(rightEpisodeCountInput.value) || 0;
        if (leftValue >= rightValue) {
            leftEpisodeCountInput.setCustomValidity('Ungültiges Veröffentlichungsdatum');
            rightEpisodeCountInput.setCustomValidity('Ungültiges Veröffentlichungsdatum');
            return;
        }

        this.episodeCountFilter.left = leftValue;
        this.episodeCountFilter.right = rightValue;
        leftEpisodeCountInput.setCustomValidity('');
        rightEpisodeCountInput.setCustomValidity('');
        this.notifyFilterUpdated();
    }

    async showGenreDialog() {
        var genreDialog = GenreDialog.show({
            genres: await GenreService.getAll(),
            allowedGenres: this.genreFilter.acceptedGenres,
            forbiddenGenres: this.genreFilter.forbiddenGenres,
            allowThreeValues: true,
        });
        genreDialog.addEventListener('decline', () => genreDialog.remove());
        genreDialog.addEventListener('accept', (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            this.genreFilter = e.detail;
            this.notifyFilterUpdated();
            genreDialog.remove();
        });
    }

    updateSearchTextFilter() {
        /** @type {HTMLInputElement} */ var searchInput = this.shadowRoot.querySelector('.search-input');
        this.searchText = searchInput.value;
        this.notifyFilterUpdated();
    }

    notifyFilterUpdated() {
        this.dispatchCustomEvent('filterUpdated', this.filter);
        this.requestUpdate(undefined);
    }

    resetFilters() {
        this.searchText = '';
        this.genreFilter = new GenreDialogResult();
        this.ratingFilter = [1, 2, 3, 4, 5];
        this.episodeCountFilter = { left: 0, right: 9999 };
        this.notifyFilterUpdated();
    }
}
