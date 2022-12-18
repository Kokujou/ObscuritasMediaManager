import { ExtendedIngredientUnit } from '../../data/enumerations/extended-ingerdient-unit.js';
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
            <form id="create-recipe-form" @submit="${(e) => page.submit(e)}">
                <div id="image-ingredients-container">
                    <div id="ingredient-container">
                        <editable-label
                            id="title"
                            .value="${page.recipe.title}"
                            @valueChanged="${(e) => page.changeProperty('title', e.detail.value)}"
                        ></editable-label>
                        ${Object.entries(groupBy(page.recipe.ingredients, 'groupName')).map((group) =>
                            renderIngredientGroup(group, page)
                        )}
                        <div id="add-ingredient-link" @click="${() => page.addGroup()}">+ Gruppe hinzufügen</div>
                    </div>
                    <div id="image-container">
                        <div id="image"></div>
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
                                .options="${Object.values(Course)}"
                                @selectionChange="${(e) => page.changeProperty('course', e.detail.value)}"
                            ></drop-down>
                        </div>
                        <div class="description-input">
                            <div class="input-title">Hauptzutat:</div>
                            <drop-down
                                id="main-ingredient"
                                .options="${Object.values(Ingredient)}"
                                @selectionChange="${(e) => page.changeProperty('mainIngredient', e.detail.value)}"
                            ></drop-down>
                        </div>
                        <div class="description-input">
                            <div class="input-title">Zubereitungsart:</div>
                            <drop-down
                                id="technique"
                                .options="${Object.values(CookingTechnique)}"
                                @selectionChange="${(e) => page.changeProperty('technique', e.detail.value)}"
                            ></drop-down>
                        </div>
                        <div class="description-input">
                            <div class="input-title">Temperatureinheit:</div>
                            <drop-down
                                id="temperature-unit"
                                .options="${Object.values(TemperatureUnit)}"
                                @selectionChange="${(e) => page.changeProperty('temperatureUnit', e.detail.value)}"
                            ></drop-down>
                        </div>
                    </div>
                    <div class="description-section" id="times-section">
                        <div class="description-input">
                            <div class="input-title">Vorbereitungsdauer:</div>
                            <timespan-input id="preparation-time"></timespan-input>
                        </div>
                        <div class="description-input">
                            <div class="input-title">Kochdauer:</div>
                            <timespan-input id="cooking-time"></timespan-input>
                        </div>
                        <div class="description-input">
                            <div class="input-title">Gesamtdauer:</div>
                            <timespan-input disabled id="total-time"></timespan-input>
                        </div>
                    </div>
                </div>
                <textarea
                    id="recipe-text"
                    oninput="this.dispatchEvent(new Event('change'))"
                    @change="${(e) => page.changeProperty('formattedText', e.target.value)}"
                >
your recipe text</textarea
                >
                <div id="action-area">
                    <input type="button" value="Abbrechen" @click="${() => page.abort()}" />
                    <input type="submit" value="Erstellen" />
                </div>
            </form>
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
                class="group-title"
                .value="${group[0]}"
                @valueChanged="${(e) => page.renameGroup(group[1], e.detail.value)}"
            ></editable-label>
            ${group[1].map((ingredient) => renderIngredient(ingredient))}
            <div id="add-group-link" @click="${() => page.addIngredient(group[0])}">+ Zutat hinzufügen</div>
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
            class="ingredient-amount"
            supportedCharacters="[0-9.]"
            .value="${ingredient.amount.toString()}"
            @valueChanged="${(e) => (ingredient.amount = Number.parseFloat(e.detail.value) ?? 0)}"
        ></editable-label>
        <grouped-dropdown
            compact
            .options="${ExtendedIngredientUnit}"
            .value="${ingredient.measurement}"
            .result="${{ category: ingredient.measurement, value: unit }}"
            class="ingredient-unit"
            @selectionChange="${(e) => ([ingredient.measurement, ingredient['unit']] = [e.detail.category, e.detail.value])}"
        ></grouped-dropdown>
        <editable-label
            class="ingredient-name"
            .value="${ingredient.name}"
            @valueChanged="${(e) => (ingredient.name = e.detail.value)}"
        ></editable-label>
        <editable-label
            class="ingredient-description"
            .value="${ingredient.description}"
            @valueChanged="${(e) => (ingredient.description = e.detail.value)}"
        ></editable-label>
    </div>`;
}
