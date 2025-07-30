import { html } from 'lit-element';

import { StarRating } from './star-rating';

export function renderStarRating(this: StarRating) {
    return html`
        ${this.vertical
            ? html`<style>
                  #star-container {
                      flex-direction: column !important;
                  }
              </style>`
            : ''}
        <div id="star-container">
            ${Array.createRange(0, this.max - 1).map(
                (x) =>
                    html`<div
                        class="star"
                        ?hovered="${this.singleSelect && this.hoveredRating > x}"
                        ?selected="${this.values.includes(x + 1)}"
                        @click="${() => this.toggleRating(x + 1)}"
                        @pointerover="${() => (this.hoveredRating = x + 1)}"
                        @pointerout="${() => (this.hoveredRating = -1)}"
                    >
                        ${this.swords ? '⚔' : '★'}
                    </div>`
            )}
        </div>
    `;
}
