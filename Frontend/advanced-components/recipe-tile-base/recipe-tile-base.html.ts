import { html } from 'lit';
import { RecipeService } from '../../services/backend.services';
import { RecipeTileBase } from './recipe-tile-base';

export function renderRecipeTileBase(this: RecipeTileBase) {
    const recipe = this.recipe.recipe;
    const imageCount = this.recipe.imageHashes.length;
    const half = Math.max(1, Math.floor(imageCount / 2));

    return html`
        <div id="recipe-images-container">
            ${this.recipe.imageHashes.map(
                (hash, index) => html`
                    <img
                        class="recipe-image"
                        decoding="async"
                        src="${RecipeService.getThumbUrl(recipe.id, hash)}"
                        style="${index === 0
                            ? 'transform: scale(0.9); filter: drop-shadow(0 0 20px black) drop-shadow(0 0 20px black);'
                            : `transform: translate(${Math.sin(index) * 10}px, ${Math.cos(index) * 10}px)
                               rotate(${(index % half) * 20 * (index % 2 ? 1 : -1)}deg);
                               z-index: -${index};`}"
                    />
                `,
            )}
            <slot></slot>
        </div>

        ${this.compact ? html`<div id="food-title">${recipe.title}</div>` : ''}
    `;
}
