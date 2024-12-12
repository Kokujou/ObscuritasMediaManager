import { html } from 'lit-element';
import { TimeSpan } from '../../data/timespan';
import { createRange } from '../../services/extensions/array.extensions';
import { RecipeTile } from './recipe-tile';

export function renderRecipeTile(this: RecipeTile) {
    var recipe = this.recipe;
    return html`
        <div id="content">
            <div id="image-container">
                <div id="image"></div>
                <div id="nation-icon" class="icon" nation="${recipe.nation}"></div>
                <div id="total-time">${TimeSpan.format(recipe.totalTime)}</div>
                <star-rating id="rating" max="5" singleSelect disabled .values="${createRange(0, recipe.rating)}"></star-rating>
                <star-rating
                    id="difficulty"
                    max="5"
                    singleSelect
                    swords
                    vertical
                    disabled
                    .values="${createRange(0, recipe.difficulty)}"
                ></star-rating>
            </div>
            <div id="text-container">
                <div id="recipe-title">${recipe.title}</div>
                <div id="">Zubereitungsart: ${recipe.technique}</div>
                <div id="">Hauptzutat: ${recipe.mainIngredient}</div>
                <div id="">Gang: ${recipe.course}</div>
            </div>
        </div>
    `;
}
