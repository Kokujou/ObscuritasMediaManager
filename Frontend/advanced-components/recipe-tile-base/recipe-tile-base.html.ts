import { html } from 'lit';
import { RecipeService } from '../../services/backend.services';
import { RecipeTileBase } from './recipe-tile-base';

export function renderRecipeTileBase(this: RecipeTileBase) {
    const recipe = this.recipe.recipe;
    const imageCount = this.recipe.imageHashes.length;

    const firstImageHash = recipe.favoriteImageHash ?? this.recipe.imageHashes[0];

    return html`
        <div id="recipe-images-container">
            <upload-area
                ?disabled="${!this.allowUpload}"
                .images="${this.recipe.imageHashes.map((hash) => RecipeService.getThumbUrl(this.recipe.recipe.id, hash))}"
            ></upload-area>

            <slot></slot>
        </div>

        ${this.compact ? html`<div id="food-title">${recipe.title}</div>` : ''}
    `;
}
