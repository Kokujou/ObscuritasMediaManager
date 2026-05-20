import { html } from 'lit';
import { TimeSpan } from '../../data/timespan';

import { RecipeTile } from './recipe-tile';

export function renderRecipeTile(this: RecipeTile) {
    return html`
        <recipe-tile-base .recipe="${this.recipe}" ?compact="${this.compact}">
            <div id="nation-icon" class="icon" @click="${() => this.notifyNationChanged()}"></div>
            <div id="total-time">${TimeSpan.format(this.fullRecipe?.totalTime ?? '00:00:00')}</div>
            <star-rating
                id="rating"
                max="5"
                singleSelect
                disabled
                .values="${Array.createRange(0, this.recipe.rating)}"
            ></star-rating>
            <star-rating
                id="difficulty"
                max="5"
                singleSelect
                swords
                vertical
                disabled
                .values="${Array.createRange(0, this.recipe.difficulty)}"
            ></star-rating>
        </recipe-tile-base>
    `;
}
