import { html } from 'lit';
import { SlideshowImage } from '../../advanced-components/image-slideshow/slideshow-image';
import { RecipeService } from '../../services/backend.services';
import { RecipeSlideshowPopup } from './recipe-slideshow-popup';

export function renderRecipeSlideshowPopup(this: RecipeSlideshowPopup) {
    if (!this.recipe) return;

    return html`
        <image-slideshow
            allowAdd
            .images="${this.recipe.imageHashes.map(
                (hash) =>
                    new SlideshowImage(
                        hash,
                        RecipeService.getImageUrl(this.recipe.recipe.id, hash),
                        RecipeService.getThumbUrl(this.recipe.recipe.id, hash),
                    ),
            )}"
            @add-image="${(e: CustomEvent<string>) => this.addImage(e.detail)}"
            @image-removed="${(e: CustomEvent<string>) => this.removeImage(e.detail)}"
        >
        </image-slideshow>
    `;
}
