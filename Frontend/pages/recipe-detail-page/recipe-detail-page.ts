import { customElement, property, query, state } from 'lit-element/decorators';
import { LanguageSwitcher } from '../../advanced-components/language-switcher/language-switcher';
import { LitElementBase } from '../../data/lit-element-base';
import { MeasurementUnits } from '../../data/measurement-units';
import { TimeSpan } from '../../data/timespan';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import {
    CookingTechnique,
    Course,
    IngredientCategory,
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
            amount: 0,
            description: 'Zutat-Beschreibung',
            groupName: 'Neue Gruppe',
            ingredientName: 'Neue Zutat',
            unit: new MeasurementUnit(MeasurementUnits[0]),
            ingredientCategory: IngredientCategory.Meat,
            order: 0,
        });
    }

    protected get emptyGroup() {
        var counter = 0;

        var defaultGroupName = 'Neue Gruppe';
        var defaultIngredient = RecipeDetailPage.newIngredient;

        while (this.recipe.ingredients.some((x) => x.groupName == defaultIngredient.groupName)) {
            counter++;
            defaultIngredient.groupName = defaultGroupName + ' ' + counter;
        }

        return defaultIngredient;
    }

    @property() public declare recipeId: string | null;

    @state() protected declare recipe: RecipeModel;

    @query('#page-container') protected declare pageContainer: HTMLElement;

    constructor() {
        super();
        this.recipe = new RecipeModel({
            title: 'Rezepttitel',
            nation: Language.Unset,
            cookingTime: new TimeSpan().toString(),
            technique: CookingTechnique.Baking,
            course: Course.Main,
            totalTime: new TimeSpan().toString(),
            cookware: [],
            preparationTime: new TimeSpan().toString(),
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
        document.title = this.recipe.id
            ? `Rezept - ${this.recipe.title}`
            : `Rezept erstellen ${this.recipe.title ? `- ${this.recipe.title}` : ''}`;
        return renderRecipeDetailPage.call(this);
    }

    async addIngredient(group: string, event: Event) {
        event.stopPropagation();
        event.preventDefault();

        const ingredient = RecipeDetailPage.newIngredient;
        ingredient.groupName = group;
        ingredient.id = await RecipeService.addIngredient(this.recipe.id!, ingredient);
        this.recipe.ingredients.push(ingredient);
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

    async removeItem(ingredient: RecipeIngredientMappingModel) {
        await RecipeService.deleteIngredient(this.recipe.id!, ingredient.id!);
        this.recipe.ingredients = this.recipe.ingredients.filter((x) => x.id != ingredient.id);

        this.requestFullUpdate();
    }

    async changeNation() {
        this.changeProperty('nation', await LanguageSwitcher.spawnAt(this.pageContainer, this.recipe.nation));
    }

    changeIngredientUnit(ingredient: RecipeIngredientMappingModel, unitName: string) {
        console.log(this.recipe.ingredients.includes(ingredient));

        var unit = MeasurementUnits.find((x) => x.name == unitName);
        if (!unit) {
            MessageSnackbar.popup('Die ausgewählte Einheit ist nicht bekannt: ' + unitName, 'error');
            return;
        }

        ingredient.unit = unit;
        this.changeProperty('ingredients', this.recipe.ingredients);
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
        try {
            this.recipe.id = await RecipeService.createRecipe(this.recipe);
            this.recipeId = this.recipe.id;
            this.requestFullUpdate();
            MessageSnackbar.popup('Das Rezept wurde erfolgreich erstellt.', 'success');
        } catch (err) {
            console.error(err);
            MessageSnackbar.popup('Ein Fehler ist beim erstellen des Rezepts aufgetreten.', 'error');
        }
    }
}
