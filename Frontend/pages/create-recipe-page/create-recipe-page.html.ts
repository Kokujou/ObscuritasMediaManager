import { html } from 'lit-element';
import { ExtendedIngredientUnit } from '../../data/enumerations/extended-ingerdient-unit';
import { TimeSpan } from '../../data/timespan';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { CookingTechnique, Course, Ingredient, IngredientModel } from '../../obscuritas-media-manager-backend-client';
import { createRange, groupBy } from '../../services/extensions/array.extensions';
import { CreateRecipePage } from './create-recipe-page';

/**
 * @param { CreateRecipePage } page
 */
export function renderCreateRecipePage(page: CreateRecipePage) {
    return html`
        <page-layout>
            <div id="page-container">
                <form id="create-recipe-form" @submit="${(e) => page.submit(e)}">
                    <div id="image-ingredients-container">
                        <div id="ingredient-container">
                            <input
                                type="text"
                                id="title"
                                .value="${page.recipe.title}"
                                onclick="javascript:this.select()"
                                @input="${(e) => handleLabelInput(e)}"
                                @change="${(e) => page.changeProperty('title', e.detail.value)}"
                            />
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
                                .values="${createRange(0, page.recipe.rating)}"
                                @ratingChanged="${(e) => page.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                            <star-rating
                                vertical
                                swords
                                id="difficulty"
                                max="5"
                                singleSelect
                                .values="${createRange(0, page.recipe.difficulty)}"
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
                                    .options="${DropDownOption.createSimpleArray(Object.values(Course), page.recipe.course)}"
                                    @selectionChange="${(e) => page.changeProperty('course', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Hauptzutat:</div>
                                <drop-down
                                    id="main-ingredient"
                                    tabindex="0"
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(Ingredient),
                                        page.recipe.mainIngredient
                                    )}"
                                    @selectionChange="${(e) => page.changeProperty('mainIngredient', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Zubereitungsart:</div>
                                <drop-down
                                    id="technique"
                                    tabindex="0"
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(CookingTechnique),
                                        page.recipe.technique
                                    )}"
                                    @selectionChange="${(e) => page.changeProperty('technique', e.detail.option.value)}"
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
function renderIngredientGroup(group: [name: string, ingredients: IngredientModel[]], page: CreateRecipePage) {
    return html`
        <div id="${group[0]}" class="ingredient-group">
            <input
                type="text"
                class="group-title"
                .value="${group[0]}"
                onclick="javascript:this.select()"
                @input="${(e) => handleLabelInput(e)}"
                @change="${(e) => page.renameGroup(group[1], e.detail.value)}"
            />
            <priority-list
                .items="${group[1]}"
                .itemRenderer="${renderIngredient}"
                @delete-item="${(e) => page.removeItem(e.detail)}"
            >
            </priority-list>
            <button tabindex="0" id="add-ingredient-link" @click="${(e) => page.addIngredient(group[0], e)}">
                + Zutat hinzufügen
            </button>
        </div>
    `;
}

/**
 * @param {IngredientModel} ingredient
 */
function renderIngredient(ingredient: IngredientModel) {
    var unit = ingredient['unit'] ?? ExtendedIngredientUnit[ingredient.measurement][0];
    return html` <div class="ingredient">
        <input
            type="text"
            class="ingredient-amount"
            supportedCharacters="[0-9.]"
            .value="${ingredient.amount.toString()}"
            onclick="javascript:this.select()"
            @input="${(e) => handleLabelInput(e, /[0-9.]/g)}"
            @change="${(e) => (ingredient.amount = Number.parseFloat(e.target.value) ?? 0)}"
        />
        <grouped-dropdown
            tabindex="0"
            compact
            .result="${{ category: ingredient.measurement, value: unit }}"
            .options="${ExtendedIngredientUnit}"
            class="ingredient-unit"
            @change="${(e) => ([ingredient.measurement, ingredient['unit']] = [e.detail.category, e.detail.value])}"
        ></grouped-dropdown>
        <input
            type="text"
            class="ingredient-name"
            .value="${ingredient.name}"
            onclick="javascript:this.select()"
            @input="${(e) => handleLabelInput(e)}"
            @change="${(e) => (ingredient.name = e.detail.value)}"
        />
        <input
            type="text"
            class="ingredient-description"
            .value="${ingredient.description}"
            onclick="javascript:this.select()"
            @input="${(e) => handleLabelInput(e)}"
            @change="${(e) => (ingredient.description = e.detail.value)}"
        />
    </div>`;
}

/**
 * @param {KeyboardEvent} e
 * @param {RegExp} [supportedCharacters]
 */
function handleLabelInput(e: KeyboardEvent, supportedCharacters?: RegExp) {
    if (!supportedCharacters || e.key.length != 1 || e.key.match(supportedCharacters)) return;
    e.target.dispatchEvent(new Event('change'));
    e.stopPropagation();
    e.preventDefault();
}
