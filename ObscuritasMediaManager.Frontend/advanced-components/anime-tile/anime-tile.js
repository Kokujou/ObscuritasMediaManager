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
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.name;
        /** @type {string} */ this.imageSource;
        /** @type {number} */ this.rating;
        /** @type {string[]} */ this.genres = [];
        /** @type {number} */ this.status;
        /** @type {boolean} */ this.disabled;

        /** @type {number} */ this.hoveredRating = 0;
    }

    render() {
        return renderAnimeTile(this);
    }
    addGenre(genre) {
        console.log(genre);
        if (genre) this.genres = this.genres.filter((x) => x);

        this.genres.push(genre);
        this.requestUpdate(undefined);

        if (!genre) return;
    }

    notifyImageClicked() {
        if (this.imageSource) return;
        this.dispatchEvent(new CustomEvent('addButtonClicked'));
    }

    notifyRatingChanged(newRating) {
        var ratingChangedEvent = new CustomEvent('ratingChanged', { detail: { newRating: newRating } });
        this.dispatchEvent(ratingChangedEvent);
    }
}
