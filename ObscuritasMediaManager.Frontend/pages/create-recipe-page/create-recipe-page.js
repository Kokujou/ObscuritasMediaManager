import { LitElementBase } from '../../data/lit-element-base.js';
import { IngredientModel, Measurement, RecipeModel, TemperatureUnit } from '../../obscuritas-media-manager-backend-client.js';
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
        this.recipe.title = 'Rezepttitel';
        this.recipe.temperatureUnit = TemperatureUnit.Celsius;
        this.recipe.ingredients = [];
        this.recipe.ingredients.push(this.emptyGroup);
    }

    render() {
        return renderCreateRecipePage(this);
    }

    addGroup() {
        this.recipe.ingredients.push(this.emptyGroup);
        this.requestUpdate(undefined);
    }

    /**
     * @param {string} group
     */
    addIngredient(group) {
        this.recipe.ingredients.push(
            new IngredientModel({
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
     * @param {SubmitEvent} event
     */
    submit(event) {
        console.log(this.recipe);
        event.preventDefault();
        event.stopPropagation();
    }

    abort() {
        history.back();
    }
}
