import { html } from 'lit';
import { RecipeTileBase } from './recipe-tile-base';

export function renderRecipeTileBase(this: RecipeTileBase) {
    return html`
        <div id="recipe-images-container">
            ${Array.createRange(0, this.recipe.imageCount - 1).map(
                (index) => html`
                    <img
                        class="recipe-image"
                        decoding="async"
                        src="./Backend/api/recipe/${this.recipe.id}/thumb/${index}"
                        style=" ${this.recipe.imageCount < 3 || index == 0
                            ? 'transform: scale(0.9); filter: drop-shadow(0 0 20px black) drop-shadow(0 0 20px black)'
                            : `transform: translate(${Math.sin(index) * 10}px, ${Math.cos(index) * 10}px) rotate(${
                                  (index % (this.recipe.imageCount / 2)) * 20 * (index % 2 != 0 ? 1 : -1)
                              }deg);  z-index: -${index};`}"
                    />
                `
            )}
        </div>
        ${this.compact ? html` <div id="food-title">${this.recipe.title}</div> ` : ''}
    `;
}
