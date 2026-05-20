import { customElement, property, query, state } from 'lit-element/decorators';
import { ImageSlideshow } from '../../advanced-components/image-slideshow/image-slideshow';
import { SlideshowImage } from '../../advanced-components/image-slideshow/slideshow-image';
import { LitElementBase } from '../../data/lit-element-base';
import { MeasurementUnits, ValuelessMeasurements } from '../../data/measurement-units';
import { TimeSpan } from '../../data/timespan';
import { waitForAnimation } from '../../extensions/animation.extension';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import {
    FoodImageModel,
    FoodTagModel,
    FoodThumbModel,
    IngredientCategory,
    IngredientModel,
    Language,
    Measurement,
    MeasurementUnit,
    RecipeCookwareMappingModel,
    RecipeImageCreationRequest,
    RecipeIngredientMappingModel,
    RecipeModel,
    RecipeModelBase,
} from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { ImageCompressionService } from '../../services/image-compression.service';
import { PageRouting } from '../page-routing/page-routing';
import { renderRecipeDetailPageStyles } from './recipe-detail-page.css';
import { renderRecipeDetailPage } from './recipe-detail-page.html';

@customElement('recipe-detail-page')
export class RecipeDetailPage extends LitElementBase {
    static isPage = true as const;

    static override get styles() {
        return renderRecipeDetailPageStyles();
    }

    static get newIngredient() {
        return new RecipeIngredientMappingModel({
            amount: 0,
            description: 'Zutat-Beschreibung',
            groupName: 'Neue Gruppe',
            ingredientName: 'Neue Zutat',
            unit: new MeasurementUnit(MeasurementUnits.find((x) => x.shortName == 'g')),
            order: 0,
            ingredient: null,
        });
    }

    protected get emptyGroup() {
        var counter = 0;

        var defaultGroupName = 'Neue Gruppe';
        var defaultIngredient = RecipeDetailPage.newIngredient;

        while (this.fullRecipe?.ingredients.some((x) => x.groupName == defaultIngredient.groupName)) {
            counter++;
            defaultIngredient.groupName = defaultGroupName + ' ' + counter;
        }

        return defaultIngredient;
    }

    @property() declare public recipeId: string | null;

    @state() declare protected recipe: RecipeModelBase;

    @query('#page-container') declare protected pageContainer: HTMLElement;

    get fullRecipe() {
        return this.recipe instanceof RecipeModel ? this.recipe : null;
    }

    constructor() {
        super();
        this.recipe = new RecipeModel({
            title: 'Rezepttitel',
            cookingTime: new TimeSpan().toString(),
            totalTime: new TimeSpan().toString(),
            cookware: [],
            preparationTime: new TimeSpan().toString(),
            difficulty: 0,
            rating: 0,
            recipeText: 'Dein Rezept-Text',
            imageCount: 0,
            images: [],
            thumbs: [],
            ingredients: [],
            tags: [],
        });
        this.fullRecipe!.ingredients = [this.emptyGroup];
    }

    override async connectedCallback() {
        super.connectedCallback();

        if (this.recipeId) {
            this.recipe = (await RecipeService.getRecipe(this.recipeId)) as RecipeModel;
            console.log(this.recipe);
            await this.requestFullUpdate();
        }
    }

    override render() {
        document.title = this.recipe.id
            ? `Rezept - ${this.recipe.title}`
            : `Rezept erstellen ${this.recipe.title ? `- ${this.recipe.title}` : ''}`;
        return renderRecipeDetailPage.call(this);
    }

    async changeBaseProperty<T extends keyof RecipeModelBase>(property: T, value: RecipeModelBase[T]) {
        this.recipe[property] = value;

        if (this.recipe.id) await RecipeService.updateRecipe(this.recipe);
        this.recipe = (await RecipeService.getRecipe(this.recipe.id!)) as RecipeModel;
        this.requestFullUpdate();
    }

    async changeProperty<T extends Exclude<keyof RecipeModel, keyof RecipeModelBase>>(property: T, value: RecipeModel[T]) {
        if (!this.fullRecipe) return;

        this.fullRecipe[property] = value;
        await RecipeService.updateRecipe(this.fullRecipe);
        this.recipe = (await RecipeService.getRecipe(this.fullRecipe.id!)) as RecipeModel;
        this.requestFullUpdate();
    }

    async addTag(tag: FoodTagModel) {
        await RecipeService.addTag(this.recipe.id!, tag);
        this.recipe = (await RecipeService.getRecipe(this.recipe.id!)) as RecipeModel;
    }

    async removeTag(tag: FoodTagModel) {
        await RecipeService.removeTag(this.recipe.id!, tag);
        this.recipe = (await RecipeService.getRecipe(this.recipe.id!)) as RecipeModel;
    }

    async addRecipe() {
        if (this.fullRecipe) return null;
        await RecipeService.changeType(this.recipe.id!, 'Recipe');
        this.recipe = (await RecipeService.getRecipe(this.recipe.id!)) as RecipeModel;
    }

    async addIngredient(group: string, event: Event) {
        if (!this.fullRecipe) return;
        event.stopPropagation();
        event.preventDefault();

        const ingredient = RecipeDetailPage.newIngredient;
        ingredient.groupName = group;
        ingredient.order = this.fullRecipe.ingredients.filter((x) => x.groupName == group).length;
        ingredient.id = await RecipeService.addIngredient(this.recipe.id!, ingredient);
        this.fullRecipe.ingredients.push(ingredient);
        this.requestFullUpdate();
    }

    async addCookware() {
        if (!this.fullRecipe) return;
        var cookware = new RecipeCookwareMappingModel({ name: '', recipeId: this.recipe.id! });
        this.fullRecipe.cookware = this.fullRecipe.cookware.concat(cookware);
        cookware.id = await RecipeService.addCookware(this.recipe.id!, cookware);
        await this.requestFullUpdate();
    }

    renameGroup(affectedIngredients: RecipeIngredientMappingModel[], newName: string) {
        for (var ingredient of affectedIngredients) ingredient.groupName = newName;
        this.changeProperty('ingredients', this.fullRecipe!.ingredients);

        this.requestFullUpdate();
    }

    async addImage(imageData: string) {
        var thumbData = (await (await ImageCompressionService.generateThumbnail(imageData)).base64()).split(',')[1];
        this.recipe = (await RecipeService.addRecipeImage(
            this.recipe.id,
            new RecipeImageCreationRequest({
                image: new FoodImageModel({ imageData, mimeType: 'image/png' }),
                thumb: new FoodThumbModel({ thumbData }),
            }),
        )) as RecipeModel;

        this.requestFullUpdate();
    }

    async removeIngredient(ingredient: RecipeIngredientMappingModel) {
        if (!this.fullRecipe) return;
        await RecipeService.deleteIngredient(this.recipe.id!, ingredient.id!);
        this.fullRecipe.ingredients = this.fullRecipe.ingredients.filter((x) => x.id != ingredient.id);
        await this.requestFullUpdate();
    }

    async removeCookware(cookware: RecipeCookwareMappingModel) {
        if (!this.fullRecipe) return;
        await RecipeService.deleteCookware(this.recipe.id!, cookware.id!);
        this.fullRecipe.cookware = this.fullRecipe.cookware.filter((x) => x.name != cookware.name);
        await this.requestFullUpdate();
    }

    changeIngredientUnit(ingredient: RecipeIngredientMappingModel, unitName: string) {
        var unit = MeasurementUnits.find((x) => x.name == unitName);
        if (!unit) {
            MessageSnackbar.popup('Die ausgewählte Einheit ist nicht bekannt: ' + unitName, 'error');
            return;
        }

        ingredient.unit = unit;
        if (ValuelessMeasurements.includes(ingredient.unit.measurement)) ingredient.amount = 1;
        this.changeProperty('ingredients', this.fullRecipe!.ingredients);
    }

    changeIngredientCategory(mapping: RecipeIngredientMappingModel, category: IngredientCategory) {
        if (mapping.ingredient) mapping.ingredient.category = category;
        else
            mapping.ingredient = new IngredientModel({
                ingredientName: mapping.ingredientName,
                nation: Language.Unset,
                category: category,
            });
        this.changeProperty('ingredients', this.fullRecipe!.ingredients);
    }

    async searchIngredients(search: string) {
        return [{ id: search, text: '+ Zutat hinzufügen' } as AutocompleteItem].concat(
            (await RecipeService.searchIngredients(search)).map((x) =>
                Object.assign(x, {
                    id: x.ingredientName,
                    text: x.ingredientName + ` (${x.isFluid ? 'flüssig' : 'fest'})`,
                } as AutocompleteItem),
            ),
        );
    }

    async searchCookware(search: string) {
        return [{ id: search, text: '+ Kochutensil hinzufügen' } as AutocompleteItem].concat(
            (await RecipeService.searchCookware(search)).map((x) => Object.assign(x, { id: x, text: x } as AutocompleteItem)),
        );
    }

    updateIngredient(source: RecipeIngredientMappingModel, target: IngredientModel & AutocompleteItem) {
        source.ingredientName = target.id!;
        source.ingredient = undefined as any;
        if (target instanceof IngredientModel) {
            const incompatibleMeasurement = target.isFluid ? Measurement.Mass : Measurement.Volume;
            if (source.unit.measurement == incompatibleMeasurement)
                source.unit = MeasurementUnits.find(
                    (x) => x.measurement == (target.isFluid ? Measurement.Volume : Measurement.Mass),
                )!;
        }
        this.requestFullUpdate();
        this.changeProperty('ingredients', this.fullRecipe!.ingredients);
    }

    updateCookware(source: RecipeCookwareMappingModel, newCookware: string) {
        source.name = newCookware;
        this.changeProperty('cookware', this.fullRecipe!.cookware);
    }

    async showSlideshow() {
        var slideShow = new ImageSlideshow();
        slideShow.allowAdd = true;
        slideShow.images = Array.createRange(0, this.recipe.imageCount - 1).map(
            (index) =>
                new SlideshowImage(
                    index.toString(),
                    `./Backend/api/recipe/${this.recipe.id}/images/${index}`,
                    `./Backend/api/recipe/${this.recipe.id}/thumbs/${index}`,
                ),
        );
        slideShow.currentIndex = 0;

        slideShow.addEventListener('add-image', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = async () => {};
            fileInput.click();
        });
        PageRouting.instance.appendChild(slideShow);

        await slideShow.requestFullUpdate();
        await slideShow.updateComplete;
        await waitForAnimation();

        document.addEventListener('click', () => slideShow.remove(), { once: true });
    }

    async createRecipe() {
        try {
            if (!this.fullRecipe) return;
            this.recipe.id = await RecipeService.createRecipe(this.fullRecipe);
            this.recipeId = this.recipe.id;
            this.requestFullUpdate();
            MessageSnackbar.popup('Das Rezept wurde erfolgreich erstellt.', 'success');
        } catch (err) {
            console.error(err);
            MessageSnackbar.popup('Ein Fehler ist beim erstellen des Rezepts aufgetreten.', 'error');
        }
    }
}
