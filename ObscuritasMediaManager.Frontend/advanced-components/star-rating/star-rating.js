import { LitElementBase } from '../../data/lit-element-base.js';
import { renderStarRatingStyles } from './star-rating.css.js';
import { renderStarRating } from './star-rating.html.js';

export class StarRating extends LitElementBase {
    static get styles() {
        return renderStarRatingStyles();
    }

    static get properties() {
        return {
            max: { type: Number, reflect: true },
            values: { type: Array, reflect: true },
            singleSelect: { type: Boolean, reflect: true },
            vertical: { type: Boolean, reflect: true },
            swords: { type: Boolean, reflect: true },

            hoveredRating: { type: Number, reflect: false },
        };
    }

    constructor() {
        super();

        /** @type {number} */ this.max;
        /** @type {number[]} */ this.values = [];
        /** @type {boolean} */ this.singleSelect = false;
        /** @type {boolean} */ this.vertical = false;
        /** @type {boolean} */ this.swords = false;

        /** @type {number} */ this.hoveredRating = 0;
    }

    render() {
        return renderStarRating(this);
    }

    toggleRating(rating) {
        var include = true;

        if (this.singleSelect) {
            this.values = [...Array(rating).keys()].map((x) => x + 1);
        } else if (this.values.includes(rating)) {
            this.values = this.values.filter((x) => x != rating);
            include = false;
        } else {
            this.values.push(rating);
        }
        this.dispatchCustomEvent('ratingChanged', { rating, include });
        this.requestUpdate(undefined);
    }
}
