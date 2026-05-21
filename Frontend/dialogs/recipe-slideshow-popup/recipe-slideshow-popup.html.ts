import { html } from 'lit';
import { SlideshowImage } from '../../advanced-components/image-slideshow/slideshow-image';
import { RecipeSlideshowPopup } from './recipe-slideshow-popup';

export function renderRecipeSlideshowPopup(this: RecipeSlideshowPopup) {
    if (!this.recipe) return;
    return html`
        <image-slideshow
            allowAdd
            .images="${Array.createRange(0, this.recipe.imageCount - 1).map(
                (index) =>
                    new SlideshowImage(
                        index.toString(),
                        `./Backend/api/recipe/${this.recipe.id}/images/${index}`,
                        `./Backend/api/recipe/${this.recipe.id}/thumbs/${index}`,
                    ),
            )}"
            @add-image="${(e: CustomEvent<string>) => this.addImage(e.detail)}"
            @image-removed="${(e: CustomEvent<string>) => this.removeImage(e.detail)}"
        >
        </image-slideshow>
    `;
}
