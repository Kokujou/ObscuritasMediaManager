import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { waitForAnimation } from '../../extensions/animation.extension';
import { FoodImageModel, FoodThumbModel, RecipeModelBase } from '../../obscuritas-media-manager-backend-client';
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

    static async popup(recipeId: string) {
        const slideShow = new RecipeSlideshowPopup();
        slideShow.recipeId = recipeId;

        PageRouting.instance.appendChild(slideShow);

        await slideShow.requestFullUpdate();
        await slideShow.updateComplete;
        await waitForAnimation();

        document.addEventListener('click', () => slideShow.remove(), { once: true });
    }

    @property() declare public recipeId: string;

    @state() declare protected recipe: RecipeModelBase;

    override render() {
        return renderRecipeSlideshowPopup.call(this);
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.recipe = await RecipeService.getRecipe(this.recipeId);
    }

    async addImage(imageData: string) {
        var thumbData = (await (await ImageCompressionService.generateThumbnail(imageData)).base64()).split(',')[1];
        imageData = imageData.split(',')[1];
        this.recipe.imageCount = (
            await RecipeService.addRecipeImage(
                this.recipe.id,
                new FoodImageModel({
                    recipeId: this.recipe.id,
                    imageData,
                    mimeType: 'image/png',
                    thumb: new FoodThumbModel({ thumbData }),
                }),
            )
        ).imageCount;

        await this.requestFullUpdate();
    }

    async removeImage(imageId: string) {
        alert('not implemented');

        await this.requestFullUpdate();
    }
}
