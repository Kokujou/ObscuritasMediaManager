import { html } from 'lit-element';
import { TimeSpan } from '../../data/timespan';
import { createRange } from '../../extensions/array.extensions';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { RecipeTile } from './recipe-tile';

export function renderRecipeTile(this: RecipeTile) {
    var recipe = this.recipe;
    return html`
        <div id="content">
            <div id="image-container">
                ${this.recipe.imageData
                    ? html`
                          <div
                              id="background-image"
                              style="background-image: url('data: image/png; base64, ${this.recipe.imageData}')"
                          ></div>
                          <img id="image" src="data: image/png; base64, ${this.recipe.imageData}" />
                          <div id="remove-image-button" @click="${this.notifyImageRemoved}">
                              <div id="trash-icon" icon="${Icons.Trash}"></div>
                          </div>
                      `
                    : this.compact
                    ? html` <upload-area></upload-area> `
                    : ''}
                <div id="nation-icon" class="icon" nation="${recipe.nation}" @click="${() => this.notifyNationChanged()}"></div>
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
            ${!this.compact
                ? html` <div id="text-container">
                      <div id="recipe-title">${recipe.title}</div>
                      <div id="">Zubereitungsart: ${recipe.technique}</div>
                      <div id="">Gang: ${recipe.course}</div>
                  </div>`
                : ''}
        </div>
    `;
}
