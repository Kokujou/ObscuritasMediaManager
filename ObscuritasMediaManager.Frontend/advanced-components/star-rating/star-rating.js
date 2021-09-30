import { LitElement } from '../../exports.js';
import { renderStarRatingStyles } from './star-rating.css.js';
import { renderStarRating } from './star-rating.html.js';

export class StarRating extends LitElement {
    static get styles() {
        return renderStarRatingStyles();
    }

    static get properties() {
        return {
            max: { type: Number, reflect: true },
            values: { type: Array, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {number} */ this.max;
        /** @type {number[]} */ this.values = [];
    }

    render() {
        return renderStarRating(this);
    }

    toggleRating(rating) {
        var include = true;
        if (this.values.includes(rating)) {
            this.values = this.values.filter((x) => x != rating);
            include = false;
        } else {
            this.values.push(rating);
        }
        this.requestUpdate(undefined);
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: { rating, include } }));
    }
}
