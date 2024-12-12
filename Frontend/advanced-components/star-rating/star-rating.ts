import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderStarRatingStyles } from './star-rating.css';
import { renderStarRating } from './star-rating.html';

@customElement('star-rating')
export class StarRating extends LitElementBase {
    static override get styles() {
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

    @property({ type: Number }) max: number;
    @property({ type: Array }) values: number[] = [];
    @property({ type: Boolean }) singleSelect = false;
    @property({ type: Boolean }) vertical = false;
    @property({ type: Boolean }) swords = false;

    @state() hoveredRating = 0;

    override render() {
        return renderStarRating.call(this);
    }

    toggleRating(rating: number) {
        var include = true;

        if (this.singleSelect) {
            this.values = [...Array(rating).keys()].map((x) => x + 1);
        } else if (this.values.includes(rating)) {
            this.values = this.values.filter((x) => x != rating);
            include = false;
        } else {
            this.values.push(rating);
        }
        this.dispatchEvent(new CustomEvent('ratingChanged', { detail: { rating, include } }));
        this.requestFullUpdate();
    }
}
