import { html } from '../../exports.js';
import { createRange } from '../../services/extensions/array.extensions.js';
import { StarRating } from './star-rating.js';

/**
 * @param { StarRating } starRating
 */
export function renderStarRating(starRating) {
    return html`
        ${starRating.vertical
            ? html`<style>
                  #star-container {
                      flex-direction: column !important;
                  }
              </style>`
            : ''}
        <div id="star-container">
            ${createRange(0, starRating.max - 1).map(
                (x) =>
                    html`<div
                        class="star"
                        ?hovered="${starRating.singleSelect && starRating.hoveredRating > x}"
                        ?selected="${starRating.values.includes(x + 1)}"
                        @click="${() => starRating.toggleRating(x + 1)}"
                        @pointerover="${() => (starRating.hoveredRating = x + 1)}"
                        @pointerout="${() => (starRating.hoveredRating = -1)}"
                    >
                        ${starRating.swords ? '⚔' : '★'}
                    </div>`
            )}
        </div>
    `;
}
