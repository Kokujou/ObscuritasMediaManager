import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { waitForAnimation } from '../../extensions/animation.extension';
import { FoodImageModel, FoodThumbModel, RecipeResponse } from '../../obscuritas-media-manager-backend-client';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { RecipeService } from '../../services/backend.services';
import { ImageCompressionService } from '../../services/image-compression.service';
import { renderRecipeSlideshowPopupStyles } from './recipe-slideshow-popup.css';
import { renderRecipeSlideshowPopup } from './recipe-slideshow-popup.html';

@customElement('recipe-slideshow-popup')
export class RecipeSlideshowPopup extends LitElementBase {
    static override get styles() {
        return renderRecipeSlideshowPopupStyles();
    }

    static popup(recipe: RecipeResponse) {
        return new Promise<void>(async (resolve) => {
            const slideShow = new RecipeSlideshowPopup();
            slideShow.recipe = recipe;

            PageRouting.instance.appendChild(slideShow);

            await slideShow.requestFullUpdate();
            await slideShow.updateComplete;
            await waitForAnimation();

            document.addEventListener(
                'click',
                () => {
                    slideShow.remove();
                    resolve();
                },
                { once: true },
            );
        });
    }

    @state() declare public recipe: RecipeResponse;

    override render() {
        return renderRecipeSlideshowPopup.call(this);
    }

    async connectedCallback() {
        await super.connectedCallback();

        Session.currentPage.subscribe(() => this.remove());
    }

    async addImage(imageData: string) {
        var thumbData = (await (await ImageCompressionService.generateThumbnail(imageData)).base64()).split(',')[1];
        imageData = imageData.split(',')[1];
        this.recipe.imageHashes = await RecipeService.addRecipeImage(
            this.recipe.recipe.id,
            new FoodImageModel({
                recipeId: this.recipe.recipe.id,
                imageData,
                mimeType: 'image/png',
                thumb: new FoodThumbModel({ thumbData }),
            }),
        );

        await this.requestFullUpdate();
    }

    async removeImage(imageId: string) {
        this.recipe.imageHashes = await RecipeService.removeRecipeImage(this.recipe.recipe.id, imageId);
        await this.requestFullUpdate();
    }
}
