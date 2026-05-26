import { html } from 'lit';
import { RecipeService } from '../../services/backend.services';
import { RecipeTileBase } from './recipe-tile-base';

export function renderRecipeTileBase(this: RecipeTileBase) {
    const recipe = this.recipe.recipe;
    const imageCount = this.recipe.imageHashes.length;

    const firstImageHash = recipe.favoriteImageHash ?? this.recipe.imageHashes[0];
    const otherImageHashes = this.recipe.imageHashes.filter((x) => x != firstImageHash);

    return html`
        <div id="recipe-images-container">
            <img
                class="recipe-image"
                decoding="async"
                src="${RecipeService.getThumbUrl(recipe.id, firstImageHash)}"
                style="transform: scale(0.9); filter: drop-shadow(0 0 20px black) drop-shadow(0 0 20px black);'"
            />

            ${imageCount < 3
                ? ''
                : otherImageHashes.map(
                      (hash, index) => html`
                          <img
                              class="recipe-image"
                              decoding="async"
                              src="${RecipeService.getThumbUrl(recipe.id, hash)}"
                              style="${`transform: 
                              rotate(${((index + 1) % (imageCount / 2)) * 20 * ((index + 1) % 2 ? 1 : -1)}deg);
                               z-index: -${index + 1};`}"
                          />
                      `,
                  )}
            <slot></slot>
        </div>

        ${this.compact ? html`<div id="food-title">${recipe.title}</div>` : ''}
    `;
}
