import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderStarRatingStyles } from './star-rating.css';
import { renderStarRating } from './star-rating.html';

@customElement('star-rating')
export class StarRating extends LitElementBase {
    static override get styles() {
        return renderStarRatingStyles();
    }

    @property({ type: Number }) public declare max: number;
    @property({ type: Array }) public declare values: number[];
    @property({ type: Boolean, reflect: true }) public declare singleSelect: boolean;
    @property({ type: Boolean, reflect: true }) public declare vertical: boolean;
    @property({ type: Boolean, reflect: true }) public declare swords: boolean;
    @state() protected declare hoveredRating: number;

    constructor() {
        super();
        this.values = [];
    }

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
