import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { IngredientModel, Language, Measurement, RecipeModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { changePage, getQueryValue } from '../../services/extensions/url.extension';
import { RecipesPage } from '../recipes-page/recipes-page';
import { renderCreateRecipePageStyles } from './create-recipe-page.css';
import { renderCreateRecipePage } from './create-recipe-page.html';

@customElement('create-recipe-page')
export class CreateRecipePage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Rezept erstellen';

    static override get styles() {
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
            order: 0,
        });

        while (this.recipe.ingredients.some((x) => x.groupName == defaultIngredient.groupName)) {
            counter++;
            defaultIngredient.groupName = defaultGroupName + ' ' + counter;
        }

        return defaultIngredient;
    }

    @property() public declare recipeId: string;
    @property({ type: Object }) public declare recipe: RecipeModel;

    constructor() {
        super();
        this.recipe = new RecipeModel({
            id: crypto.randomUUID(),
            title: 'Rezepttitel',
            nation: Language.Unset,
            difficulty: 0,
            rating: 0,
            formattedText: 'Dein Rezept-Text',
            ingredients: [this.emptyGroup],
        });
    }

    override async connectedCallback() {
        super.connectedCallback();

        var requestedRecipeId = getQueryValue('recipe');
        if (requestedRecipeId) {
            this.recipe = await RecipeService.getRecipe(requestedRecipeId);
            await this.requestFullUpdate();
        }
    }

    override render() {
        return renderCreateRecipePage.call(this);
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
        this.recipe.ingredients.push(
            new IngredientModel({
                id: crypto.randomUUID(),
                recipeId: crypto.randomUUID(),
                amount: 0,
                description: 'Zutat-Beschreibung',
                groupName: group,
                name: 'Neue Zutat',
                measurement: Measurement.Mass,
                order: this.recipe.ingredients.filter((x) => x.groupName == group).length,
            })
        );
        this.requestFullUpdate();
    }

    changeProperty<T extends keyof RecipeModel>(property: T, value: RecipeModel[T]) {
        this.recipe[property] = value;
        this.requestFullUpdate();
    }

    renameGroup(affectedIngredients: IngredientModel[], newName: string) {
        for (var ingredient of affectedIngredients) ingredient.groupName = newName;

        this.requestFullUpdate();
    }

    notifyImageAdded(imageData: string) {
        this.recipe.imageUrl = imageData;
        this.requestFullUpdate();
    }

    removeItem(ingredient: IngredientModel) {
        this.recipe.ingredients = this.recipe.ingredients.filter((x) => x.id != ingredient.id);
        this.requestFullUpdate();
    }

    async submit(event: SubmitEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!this.recipe.course || !this.recipe.course || !this.recipe.mainIngredient || !this.recipe.technique) {
            MessageSnackbar.popup('Bitte alle notwendigen Informationen ausfüllen.', 'error');
            return;
        }

        if (getQueryValue('recipe')) await RecipeService.updateRecipe(this.recipe);
        else await RecipeService.createRecipe(this.recipe);

        changePage(RecipesPage);
    }

    abort() {
        history.back();
    }
}
