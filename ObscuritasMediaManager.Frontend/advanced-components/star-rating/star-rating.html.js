import { html } from '../../exports.js';
import { StarRating } from './star-rating.js';

/**
 * @param { StarRating } starRating
 */
export function renderStarRating(starRating) {
    return html`
        <div id="star-container">
            ${[...new Array(starRating.max).keys()].map(
                (x) =>
                    html`<div
                        class="star"
                        ?selected="${starRating.values.includes(x + 1)}"
                        @click="${() => starRating.toggleRating(x + 1)}"
                    >
                        ★
                    </div>`
            )}
        </div>
    `;
}
