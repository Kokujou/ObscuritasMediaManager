import { ExtendedIngredientUnit } from '../../data/enumerations/extended-ingerdient-unit.js';
import { TimeSpan } from '../../data/timespan.js';
import { html } from '../../exports.js';
import {
    CookingTechnique,
    Course,
    Ingredient,
    IngredientModel,
    TemperatureUnit,
} from '../../obscuritas-media-manager-backend-client.js';
import { groupBy } from '../../services/extensions/array.extensions.js';
import { CreateRecipePage } from './create-recipe-page.js';

/**
 * @param { CreateRecipePage } page
 */
export function renderCreateRecipePage(page) {
    return html`
        <page-layout>
            <div id="page-container">
                <form id="create-recipe-form" @submit="${(e) => page.submit(e)}">
                    <div id="image-ingredients-container">
                        <div id="ingredient-container">
                            <editable-label
                                tabindex="-1"
                                editEnabled
                                id="title"
                                .value="${page.recipe.title}"
                                @valueChanged="${(e) => page.changeProperty('title', e.detail.value)}"
                            ></editable-label>
                            ${Object.entries(groupBy(page.recipe.ingredients, 'groupName')).map((group) =>
                                renderIngredientGroup(group, page)
                            )}
                            <button tabindex="0" id="add-group-link" @click="${(e) => page.addGroup(e)}">
                                + Gruppe hinzufügen
                            </button>
                        </div>
                        <div id="image-container">
                            <div
                                id="image"
                                ?set="${page.recipe.imageUrl}"
                                style="background-image: url('${page.recipe.imageUrl}')"
                            >
                                <upload-area @imageReceived="${(e) => page.notifyImageAdded(e.detail.imageData)}"></upload-area>
                            </div>

                            <star-rating
                                id="rating"
                                max="5"
                                singleSelect
                                @ratingChanged="${(e) => page.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                            <star-rating
                                vertical
                                swords
                                id="difficulty"
                                max="5"
                                singleSelect
                                @ratingChanged="${(e) => page.changeProperty('difficulty', e.detail.rating)}"
                            ></star-rating>
                            <div id="nation-icon" nation="${page.recipe.nation}"></div>
                        </div>
                    </div>

                    <div id="description-area">
                        <div class="description-section" id="dropdown-section">
                            <div class="description-input">
                                <div class="input-title">Gang:</div>
                                <drop-down
                                    id="course"
                                    tabindex="0"
                                    .options="${Object.values(Course)}"
                                    .value="${page.recipe.course}"
                                    @selectionChange="${(e) => page.changeProperty('course', e.detail.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Hauptzutat:</div>
                                <drop-down
                                    id="main-ingredient"
                                    tabindex="0"
                                    .options="${Object.values(Ingredient)}"
                                    .value="${page.recipe.mainIngredient}"
                                    @selectionChange="${(e) => page.changeProperty('mainIngredient', e.detail.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Zubereitungsart:</div>
                                <drop-down
                                    id="technique"
                                    tabindex="0"
                                    .options="${Object.values(CookingTechnique)}"
                                    .value="${page.recipe.technique}"
                                    @selectionChange="${(e) => page.changeProperty('technique', e.detail.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Temperatureinheit:</div>
                                <drop-down
                                    id="temperature-unit"
                                    tabindex="0"
                                    .options="${Object.values(TemperatureUnit)}"
                                    .value="${page.recipe.temperatureUnit}"
                                    @selectionChange="${(e) => page.changeProperty('temperatureUnit', e.detail.value)}"
                                ></drop-down>
                            </div>
                        </div>
                        <div class="description-section" id="times-section">
                            <div class="description-input">
                                <div class="input-title">Vorbereitungsdauer:</div>
                                <duration-input
                                    id="preparation-time"
                                    .timespan="${TimeSpan.fromString(page.recipe.preparationTime)}"
                                    @duration-changed="${(e) => page.changeProperty('preparationTime', e.detail)}"
                                ></duration-input>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Kochdauer:</div>
                                <duration-input
                                    id="cooking-time"
                                    .timespan="${TimeSpan.fromString(page.recipe.cookingTime)}"
                                    @duration-changed="${(e) => page.changeProperty('cookingTime', e.detail)}"
                                ></duration-input>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Gesamtdauer:</div>
                                <duration-input
                                    disabled
                                    id="total-time"
                                    .timespan="${TimeSpan.fromString(page.recipe.totalTime)}"
                                    @duration-changed="${(e) => page.changeProperty('totalTime', e.detail)}"
                                ></duration-input>
                            </div>
                        </div>
                    </div>
                    <textarea
                        id="recipe-text"
                        oninput="this.dispatchEvent(new Event('change'))"
                        @change="${(e) => page.changeProperty('formattedText', e.target.value)}"
                        .value="${page.recipe.formattedText}"
                    >
                    </textarea>
                    <div id="action-area">
                        <input type="button" value="Abbrechen" @click="${() => page.abort()}" />
                        <input type="submit" value="Erstellen" />
                    </div>
                </form>
            </div>
        </page-layout>
    `;
}

/**
 * @param {[name: string, ingredients: IngredientModel[]]} group
 * @param {CreateRecipePage} page
 */
function renderIngredientGroup(group, page) {
    return html`
        <div id="${group[0]}" class="ingredient-group">
            <editable-label
                editEnabled
                class="group-title"
                .value="${group[0]}"
                @valueChanged="${(e) => page.renameGroup(group[1], e.detail.value)}"
            ></editable-label>
            ${group[1].map((ingredient) => renderIngredient(ingredient))}
            <button tabindex="0" id="add-ingredient-link" @click="${(e) => page.addIngredient(group[0], e)}">
                + Zutat hinzufügen
            </button>
        </div>
    `;
}

/**
 * @param {IngredientModel} ingredient
 */
function renderIngredient(ingredient) {
    var unit = ingredient['unit'] ?? 'Gram';
    return html` <div class="ingredient">
        <editable-label
            editEnabled
            class="ingredient-amount"
            supportedCharacters="[0-9.]"
            .value="${ingredient.amount.toString()}"
            @valueChanged="${(e) => (ingredient.amount = Number.parseFloat(e.detail.value) ?? 0)}"
        ></editable-label>
        <grouped-dropdown
            tabindex="0"
            compact
            .options="${ExtendedIngredientUnit}"
            .value="${ingredient.measurement}"
            .result="${{ category: ingredient.measurement, value: unit }}"
            class="ingredient-unit"
            @selectionChange="${(e) => ([ingredient.measurement, ingredient['unit']] = [e.detail.category, e.detail.value])}"
        ></grouped-dropdown>
        <editable-label
            editEnabled
            class="ingredient-name"
            .value="${ingredient.name}"
            @valueChanged="${(e) => (ingredient.name = e.detail.value)}"
        ></editable-label>
        <editable-label
            editEnabled
            class="ingredient-description"
            .value="${ingredient.description}"
            @valueChanged="${(e) => (ingredient.description = e.detail.value)}"
        ></editable-label>
    </div>`;
}
