import { customElement, property, query } from 'lit-element/decorators';
import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher';
import { LitElementBase } from '../../data/lit-element-base';
import { MeasurementUnits } from '../../data/measurement-units';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import {
    Language,
    MeasurementUnit,
    RecipeIngredientMappingModel,
    RecipeModel,
} from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { changePage, getQueryValue } from '../../services/extensions/url.extension';
import { RecipesPage } from '../recipes-page/recipes-page';
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
            id: crypto.randomUUID(),
            recipeId: crypto.randomUUID(),
            amount: 0,
            description: 'Zutat-Beschreibung',
            groupName: 'Neue Gruppe',
            ingredientName: 'Neue Zutat',
            unit: new MeasurementUnit(MeasurementUnits[0]),
            order: 0,
        });
    }

    get emptyGroup() {
        var counter = 0;

        var defaultGroupName = 'Neue Gruppe';
        var defaultIngredient = RecipeDetailPage.newIngredient;

        while (this.recipe.ingredients.some((x) => x.groupName == defaultIngredient.groupName)) {
            counter++;
            defaultIngredient.groupName = defaultGroupName + ' ' + counter;
        }

        return defaultIngredient;
    }

    @property() public declare recipeId: string;
    @property({ type: Object }) public declare recipe: RecipeModel;

    @query('#page-container') protected declare pageContainer: HTMLElement;

    constructor() {
        super();
        this.recipe = new RecipeModel({
            id: crypto.randomUUID(),
            title: 'Rezepttitel',
            nation: Language.Unset,
            difficulty: 0,
            rating: 0,
            formattedText: 'Dein Rezept-Text',
            ingredients: [],
        });
        this.recipe.ingredients = [this.emptyGroup];
    }

    override async connectedCallback() {
        super.connectedCallback();

        if (this.recipeId) {
            this.recipe = await RecipeService.getRecipe(this.recipeId);
            await this.requestFullUpdate();
        }
    }

    override render() {
        return renderRecipeDetailPage.call(this);
    }

    addGroup(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.recipe.ingredients.push(this.emptyGroup);
        this.requestFullUpdate();
    }

    addIngredient(group: string, event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.recipe.ingredients.push(RecipeDetailPage.newIngredient);
        this.requestFullUpdate();
    }

    async changeProperty<T extends keyof RecipeModel>(property: T, value: RecipeModel[T]) {
        this.recipe[property] = value;
        if (this.recipe.id) await RecipeService.updateRecipe(this.recipe);
        this.requestFullUpdate();
    }

    renameGroup(affectedIngredients: RecipeIngredientMappingModel[], newName: string) {
        for (var ingredient of affectedIngredients) ingredient.groupName = newName;

        this.requestFullUpdate();
    }

    notifyImageAdded(imageData: string) {
        this.recipe.imageUrl = imageData;
        this.requestFullUpdate();
    }

    removeItem(ingredient: RecipeIngredientMappingModel) {
        this.recipe.ingredients = this.recipe.ingredients.filter((x) => x.id != ingredient.id);
        this.requestFullUpdate();
    }

    async changeNation() {
        this.changeProperty('nation', await LanguageSwitcher.spawnAt(this.pageContainer, this.recipe.nation));
    }

    async submit(event: SubmitEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.recipe.course || !this.recipe.course || !this.recipe.technique) {
            MessageSnackbar.popup('Bitte alle notwendigen Informationen ausfüllen.', 'error');
            return;
        }

        if (getQueryValue('recipe')) await RecipeService.updateRecipe(this.recipe);
        else await RecipeService.createRecipe(this.recipe);

        changePage(RecipesPage);
    }

    async createRecipe() {
        this.recipe.id = await RecipeService.createRecipe(this.recipe);
        this.requestFullUpdate();
    }
}
