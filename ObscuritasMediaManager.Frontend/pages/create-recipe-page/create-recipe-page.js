import { LitElementBase } from '../../data/lit-element-base.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    IngredientModel,
    Measurement,
    Nation,
    RecipeModel,
    TemperatureUnit,
} from '../../obscuritas-media-manager-backend-client.js';
import { RecipeService } from '../../services/backend.services.js';
import { changePage, getPageName, getQueryValue } from '../../services/extensions/url.extension.js';
import { RecipesPage } from '../recipes-page/recipes-page.js';
import { renderCreateRecipePageStyles } from './create-recipe-page.css.js';
import { renderCreateRecipePage } from './create-recipe-page.html.js';

export class CreateRecipePage extends LitElementBase {
    static get isPage() {
        return true;
    }

    static get styles() {
        return renderCreateRecipePageStyles();
    }

    get emptyGroup() {
        var counter = 0;

        var defaultGroupName = 'Neue Gruppe';
        var defaultIngredient = new IngredientModel({
            id: crypto.randomUUID(),
            recipeId: crypto.randomUUID(),
            amount: 0,
            description: 'Zutat-Beschreibung',
            groupName: 'Neue Gruppe',
            name: 'Neue Zutat',
            measurement: Measurement.Mass,
        });

        while (this.recipe.ingredients.some((x) => x.groupName == defaultIngredient.groupName)) {
            counter++;
            defaultIngredient.groupName = defaultGroupName + ' ' + counter;
        }

        return defaultIngredient;
    }

    constructor() {
        super();
        document.title = 'Rezept erstellen';

        /** @type {RecipeModel} */ this.recipe = new RecipeModel();
        this.recipe.id = crypto.randomUUID();
        this.recipe.title = 'Rezepttitel';
        this.recipe.temperatureUnit = TemperatureUnit.None;
        this.recipe.ingredients = [];
        this.recipe.nation = Nation.Unset;
        this.recipe.difficulty = 0;
        this.recipe.rating = 0;
        this.recipe.formattedText = 'Dein Rezept-Text';
        this.recipe.ingredients.push(this.emptyGroup);
    }

    async connectedCallback() {
        super.connectedCallback();

        var requestedRecipeId = getQueryValue('recipe');
        if (requestedRecipeId) {
            this.recipe = await RecipeService.getRecipe(requestedRecipeId);
            await this.requestUpdate(undefined);
        }
    }

    render() {
        return renderCreateRecipePage(this);
    }

    /**
     * @param {Event} event
     */
    addGroup(event) {
        event.stopPropagation();
        event.preventDefault();
        this.recipe.ingredients.push(this.emptyGroup);
        this.requestUpdate(undefined);
    }

    /**
     * @param {string} group
     * @param {Event} event
     */
    addIngredient(group, event) {
        event.stopPropagation();
        event.preventDefault();
        this.recipe.ingredients.push(
            new IngredientModel({
                id: crypto.randomUUID(),
                recipeId: crypto.randomUUID(),
                amount: 0,
                description: 'Zutat-Beschreibung',
                groupName: group,
                name: 'Neue Zutat',
                measurement: Measurement.Mass,
            })
        );
        this.requestUpdate(undefined);
    }

    /**
     *
     * @param {keyof import('../../obscuritas-media-manager-backend-client.js').IRecipeModel} property
     * @param {string} value
     */
    changeProperty(property, value) {
        /** @type {any} */ (this.recipe[property]) = value;
        this.requestUpdate(undefined);
    }

    /**
     *
     * @param { IngredientModel[] } affectedIngredients
     * @param {string} newName
     */
    renameGroup(affectedIngredients, newName) {
        for (var ingredient of affectedIngredients) ingredient.groupName = newName;

        this.requestUpdate(undefined);
    }

    /**
     * @param {string} imageData
     */
    notifyImageAdded(imageData) {
        this.recipe.imageUrl = imageData;
        this.requestUpdate(undefined);
    }

    /**
     * @param {SubmitEvent} event
     */
    async submit(event) {
        event.preventDefault();
        event.stopPropagation();

        if (
            !this.recipe.course ||
            !this.recipe.course ||
            !this.recipe.mainIngredient ||
            !this.recipe.technique ||
            !this.recipe.temperatureUnit
        ) {
            MessageSnackbar.popup('Bitte alle notwendigen Informationen ausfüllen.', 'error');
            return;
        }

        await RecipeService.createRecipe(this.recipe);
        changePage(getPageName(RecipesPage));
    }

    abort() {
        history.back();
    }
}
