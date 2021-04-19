import { LitElement } from '../../exports.js';
import { renderAnimeTileStyles } from './anime-tile.css.js';
import { renderAnimeTile } from './anime-tile.html.js';

export class AnimeTile extends LitElement {
    static get styles() {
        return renderAnimeTileStyles();
    }

    static get properties() {
        return {
            name: { type: String, reflect: true },
            imageSource: { type: String, reflect: true },
            rating: { type: Number, reflect: true },
            genres: { type: Array, reflect: true },
            status: { type: Number, reflect: true },
            disabled: { type: Boolean, reflect: true },

            hoveredRating: { type: Number, reflect: false },
            newGenre: { type: Boolean, reflect: false },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.name;
        /** @type {string} */ this.imageSource;
        /** @type {number} */ this.rating;
        /** @type {string[]} */ this.genres = [];
        /** @type {number} */ this.status;
        /** @type {boolean} */ this.disabled = false;

        /** @type {number} */ this.hoveredRating = 0;
        /** @type {boolean} */ this.newGenre = false;
    }

    attributeChangedCallback(name, old, value) {
        if (name == 'genres') this.newGenre = false;
    }

    render() {
        return renderAnimeTile(this);
    }
    addGenre(genre) {
        if (genre) this.genres = this.genres.filter((x) => x);

        if (!genre) {
            this.genres.push(genre);
            this.requestUpdate(undefined);
            return;
        }

        this.notifyGenresChanged(this.genres.concat(genre));
    }

    /**
     * @param {string} genre
     */
    removeGenre(genre) {
        if (genre) this.genres = this.genres.filter((x) => x);

        this.notifyGenresChanged(this.genres.filter((x) => x !== genre));
    }

    notifyImageClicked() {
        if (this.imageSource) return;
        this.dispatchEvent(new CustomEvent('addButtonClicked'));
    }

    notifyRatingChanged(newRating) {
        var ratingChangedEvent = new CustomEvent('ratingChanged', { detail: { newRating: newRating } });
        this.dispatchEvent(ratingChangedEvent);
    }

    notifyGenresChanged(genres) {
        var genresChangedEvent = new CustomEvent('genresChanged', { detail: { genres: genres } });
        this.dispatchEvent(genresChangedEvent);
    }
}
