import { LitElementBase } from '../../data/lit-element-base.js';
import { renderMediaTileStyles } from './media-tile.css.js';
import { renderMediaTile } from './media-tile.html.js';

export class MediaTile extends LitElementBase {
    static get styles() {
        return renderMediaTileStyles();
    }

    static get properties() {
        return {
            displayStyle: { type: String, reflect: true },
            name: { type: String, reflect: true },
            imageSource: { type: String, reflect: true },
            rating: { type: Number, reflect: true },
            genres: { type: Array, reflect: true },
            autocompleteGenres: { type: Array, reflect: true },
            status: { type: String, reflect: true },

            hoveredRating: { type: Number, reflect: false },
        };
    }

    constructor() {
        super();

        /** @type {string} */ this.displayStyle = 'solid';
        /** @type {string} */ this.name = '';
        /** @type {string} */ this.imageSource = '';
        /** @type {number} */ this.rating = 0;
        /** @type {string[]} */ this.genres = [];
        /** @type {string[]} */ this.autocompleteGenres = [];
        /** @type {string} */ this.status = '';

        /** @type {number} */ this.hoveredRating = 0;
    }

    render() {
        return renderMediaTile(this);
    }
    /**
     * @param {string} genre
     */
    addGenre(genre) {
        if (!genre) return;
        if (genre) this.genres = this.genres.filter((x) => x);

        if (!genre) {
            this.genres.push(genre);
            this.requestFullUpdate();
            return;
        }

        this.notifyGenresChanged(this.genres.concat(genre), null);
    }

    /**
     * @param {number} newRating
     * @param {Event} e
     */
    notifyRatingChanged(newRating, e) {
        e.stopPropagation();
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: { newRating: newRating } }));
    }

    /**
     * @param {string[]} genres
     * @param {Event} e
     */
    notifyGenresChanged(genres, e) {
        e?.stopPropagation();
        this.dispatchEvent(new CustomEvent('genresChanged', { detail: { genres: genres } }));
    }

    notifyImageAdded(imageData) {
        this.dispatchEvent(new CustomEvent('imageReceived', { detail: { imageData: imageData } }));
    }
}
