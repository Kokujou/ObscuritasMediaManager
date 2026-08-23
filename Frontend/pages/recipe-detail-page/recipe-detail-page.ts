import { customElement, property, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { MeasurementUnits, ValuelessMeasurements } from '../../data/measurement-units';
import { Session } from '../../data/session';
import { RecipeSlideshowPopup } from '../../dialogs/recipe-slideshow-popup/recipe-slideshow-popup';
import { emptyGuid } from '../../extensions/crypto.extensions';
import { changePage } from '../../extensions/url.extension';
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
    RecipeIngredientMappingModel,
    RecipeModel,
    RecipeModelBase,
    RecipeResponse,
} from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { ImageCompressionService } from '../../services/image-compression.service';
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
            description: '',
            groupName: 'Neue Gruppe',
            ingredientName: '',
            unit: new MeasurementUnit(MeasurementUnits.find((x) => x.shortName == 'g')),
            order: 0,
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

    @state() declare protected recipe: RecipeResponse;

    @query('#page-container') declare protected pageContainer: HTMLElement;

    protected get fullRecipe() {
        return this.recipe.recipe instanceof RecipeModel ? this.recipe.recipe : null;
    }

    override async connectedCallback() {
        super.connectedCallback();

        if (this.recipeId) {
            this.recipe = await RecipeService.getRecipe(this.recipeId);
            await this.requestFullUpdate();
        } else {
            this.recipe = new RecipeResponse({
                recipe: await RecipeService.getDefault(),
                imageHashes: [],
            });
            this.fullRecipe!.ingredients = [this.emptyGroup];
        }
    }

    override render() {
        if (!this.recipe) return null;
        return renderRecipeDetailPage.call(this);
    }

    async changeBaseProperty<T extends keyof RecipeModelBase>(property: T, value: RecipeModelBase[T]) {
        this.recipe.recipe[property] = value;

        if (this.recipe.recipe.id) await RecipeService.updateRecipe(this.recipe.recipe);
        this.recipe = await RecipeService.getRecipe(this.recipe.recipe.id!);
        this.requestFullUpdate();
    }

    async changeProperty<T extends Exclude<keyof RecipeModel, keyof RecipeModelBase>>(property: T, value: RecipeModel[T]) {
        if (!this.fullRecipe) return;

        this.fullRecipe[property] = value;
        await RecipeService.updateRecipe(this.fullRecipe);
        this.recipe = await RecipeService.getRecipe(this.fullRecipe.id!);
        this.requestFullUpdate();
    }

    async addTag(tag: FoodTagModel) {
        await RecipeService.addTag(this.recipe.recipe.id!, tag);
        this.recipe = await RecipeService.getRecipe(this.recipe.recipe.id!);
    }

    async removeTag(tag: FoodTagModel) {
        await RecipeService.removeTag(this.recipe.recipe.id!, tag);
        this.recipe = await RecipeService.getRecipe(this.recipe.recipe.id!);
    }

    async addRecipe() {
        if (this.fullRecipe) return null;
        await RecipeService.changeType(this.recipe.recipe.id!, 'Recipe');
        this.recipe = await RecipeService.getRecipe(this.recipe.recipe.id!);
    }

    async addIngredient(group: string, event: Event) {
        if (!this.fullRecipe) return;
        event.stopPropagation();
        event.preventDefault();

        const ingredient = RecipeDetailPage.newIngredient;
        ingredient.groupName = group;
        ingredient.order = this.fullRecipe.ingredients.filter((x) => x.groupName == group).length;
        ingredient.id = await RecipeService.addIngredient(this.recipe.recipe.id!, ingredient);
        this.fullRecipe.ingredients.push(ingredient);
        this.requestFullUpdate();
    }

    async addCookware() {
        if (!this.fullRecipe) return;
        var cookware = new RecipeCookwareMappingModel({ name: '', recipeId: this.recipe.recipe.id! });
        this.fullRecipe.cookware = this.fullRecipe.cookware.concat(cookware);
        cookware.id = await RecipeService.addCookware(this.recipe.recipe.id!, cookware);
        await this.requestFullUpdate();
    }

    renameGroup(affectedIngredients: RecipeIngredientMappingModel[], newName: string) {
        for (var ingredient of affectedIngredients) ingredient.groupName = newName;
        this.changeProperty('ingredients', this.fullRecipe!.ingredients);

        this.requestFullUpdate();
    }

    async removeIngredient(ingredient: RecipeIngredientMappingModel) {
        if (!this.fullRecipe) return;
        await RecipeService.deleteIngredient(this.recipe.recipe.id!, ingredient.id!);
        this.fullRecipe.ingredients = this.fullRecipe.ingredients.filter((x) => x.id != ingredient.id);
        await this.requestFullUpdate();
    }

    async removeCookware(cookware: RecipeCookwareMappingModel) {
        if (!this.fullRecipe) return;
        await RecipeService.deleteCookware(this.recipe.recipe.id!, cookware.id!);
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

    async changeIngredientCategory(mapping: RecipeIngredientMappingModel, category: IngredientCategory) {
        mapping.ingredient ??= new IngredientModel({
            ingredientName: mapping.ingredientName,
            category: category,
            nation: Language.Unset,
        });

        mapping.ingredient.category = category;
        await RecipeService.upsertIngredient(mapping.ingredientName, mapping.ingredient);
        this.requestFullUpdate();
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

    async addImage(imageData: string) {
        if (!this.recipe.recipe.id || this.recipe.recipe.id == emptyGuid) {
            this.recipe.imageHashes.push(imageData);
            return;
        }
        const thumbData = (
            await (await ImageCompressionService.generateThumbnail('data:image/png;base64,' + imageData)).base64()
        ).split(',')[1];
        this.recipe.imageHashes = await RecipeService.addRecipeImage(
            this.recipe.recipe.id,
            new FoodImageModel({
                recipeId: this.recipe.recipe.id!,
                imageData: imageData,
                mimeType: 'image/png',
                thumb: new FoodThumbModel({ thumbData }),
            }),
        );
        await this.requestFullUpdate();
    }

    async createRecipe() {
        try {
            if (!this.fullRecipe) return;
            const recipeImages = this.recipe.imageHashes;
            this.recipe.imageHashes = [];
            this.recipe.recipe.id = await RecipeService.createRecipe(this.fullRecipe);
            this.recipeId = this.recipe.recipe.id;
            for (var image of recipeImages) {
                const thumbData = (
                    await (await ImageCompressionService.generateThumbnail('data:image/png;base64,' + image)).base64()
                ).split(',')[1];
                await RecipeService.addRecipeImage(
                    this.recipe.recipe.id,
                    new FoodImageModel({
                        recipeId: this.recipe.recipe.id,
                        imageData: image,
                        mimeType: 'image/png',
                        thumb: new FoodThumbModel({ thumbData }),
                    }),
                );
            }

            changePage(RecipeDetailPage, { recipeId: this.recipe.recipe.id });

            this.requestFullUpdate();
            MessageSnackbar.popup('Das Rezept wurde erfolgreich erstellt.', 'success');
        } catch (err) {
            console.error(err);
            MessageSnackbar.popup('Ein Fehler ist beim erstellen des Rezepts aufgetreten.', 'error');
        }
    }

    async showRecipeSlideshow() {
        await RecipeSlideshowPopup.popup(this.recipe);
        await this.requestFullUpdate();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        Session.recipes.next(Session.recipes.current().replace((x) => x.recipe.id == this.recipe.recipe.id, this.recipe));
    }
}
