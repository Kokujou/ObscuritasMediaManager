import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { InputDialog } from '../../dialogs/input-dialog/input-dialog';

import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { RecipeModel } from '../../obscuritas-media-manager-backend -obscuritas-media-manager-services-client';
import { IngredientCategory, IngredientModel, Language } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { ObjectFilterService } from '../../services/object-filter.service';
import { renderShoppingPageStyles } from './shopping-page.css';
import { renderShoppingPage } from './shopping-page.html';

@customElement('shopping-page')
export class ShoppingPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Shopping';

    static override get styles() {
        return renderShoppingPageStyles();
    }

    get ingredients() {
        return [
            ...Session.ingredients.current(),
            ...Session.recipes.current().flatMap((recipe) =>
                recipe instanceof RecipeModel
                    ? recipe.ingredients
                          .filter((x) => !Session.ingredients.current().some((y) => x.ingredientName == y.ingredientName))
                          .map(
                              (y) =>
                                  y.ingredient ??
                                  new IngredientModel({
                                      ingredientName: y.ingredientName,
                                      lowestKnownPrice: '',
                                      category: IngredientCategory.Miscellaneous,
                                      nation: Language.Unset,
                                  })
                          )
                    : []
            ),
        ];
    }

    get filteredIngredients() {
        const ingredients = [...this.ingredients];
        ObjectFilterService.applyMultiPropertySearch(ingredients, this.searchText ?? '', 'ingredientName');
        const filtered = ingredients
            .filter((x) => !this.nation || this.nation == Language.Unset || x.nation == this.nation)
            .filter((x) => !this.category || x.category == this.category)
            .concat(ingredients.filter((x) => this.newIngredients.includes(x.ingredientName)))
            .distinctBy((x) => x.ingredientName);

        const sorted = filtered.orderBy(
            (i) => !this.newIngredients.includes(i.ingredientName),
            (i) => !Session.favoriteIngredients.includes(i.ingredientName),
            (i) => i.ingredientName.toLowerCase()
        );

        return sorted;
    }

    @state() protected declare searchText?: string;
    @state() protected declare category?: IngredientCategory;
    @state() protected declare nation?: Language;
    @state() protected declare newIngredients: string[];

    constructor() {
        super();
        this.newIngredients = [];
    }

    override render() {
        return renderShoppingPage.call(this);
    }

    async updateIngredient<T extends keyof IngredientModel>(ingredient: IngredientModel, property: T, value: IngredientModel[T]) {
        try {
            ingredient[property] = value;
            if (!Session.ingredients.current().some((x) => x.ingredientName == ingredient.ingredientName))
                Session.ingredients.current().push(ingredient);
            await RecipeService.updateIngredient(ingredient.ingredientName, ingredient);
            this.requestFullUpdate();
        } catch (err) {
            MessageSnackbar.popup(
                `Ein Fehler ist beim Update von '${property}' Zutat ${ingredient.ingredientName} aufgetreten: ${err}`,
                'error'
            );
        }
    }

    async createIngredient() {
        var ingredientName = await InputDialog.show('Neue Zutat erstellen', 'Zutatenname eingeben:');
        if (!ingredientName) return;

        try {
            var newIngredient = new IngredientModel({
                ingredientName: ingredientName,
                category: IngredientCategory.Miscellaneous,
                lowestKnownPrice: '',
                nation: Language.Unset,
            });
            this.newIngredients.push(newIngredient.ingredientName);
            await RecipeService.updateIngredient(ingredientName, newIngredient);
            MessageSnackbar.popup('Zutat wurde erfolgreich erstellt.', 'success');
            Session.ingredients.next([newIngredient, ...Session.ingredients.current()]);
            await this.requestFullUpdate();
        } catch (err) {
            MessageSnackbar.popup('Fehler beim erstellen der Zutat: ' + err, 'error');
        }
    }

    markAsFavorite(ingredient: IngredientModel) {
        if (!Session.favoriteIngredients.includes(ingredient.ingredientName))
            Session.favoriteIngredients = Session.favoriteIngredients.concat(ingredient.ingredientName);
        else Session.favoriteIngredients = Session.favoriteIngredients.filter((x) => x != ingredient.ingredientName);
        this.requestFullUpdate();
    }
}
