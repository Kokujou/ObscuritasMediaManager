import { html } from 'lit-element';
import { ExtendedIngredientUnit } from '../../data/enumerations/extended-ingerdient-unit';
import { TimeSpan } from '../../data/timespan';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { GroupedDropdownResult } from '../../native-components/grouped-dropdown/grouped-dropdown';
import {
    CookingTechnique,
    Course,
    Ingredient,
    IngredientModel,
    Measurement,
} from '../../obscuritas-media-manager-backend-client';
import { createRange, groupBy } from '../../services/extensions/array.extensions';
import { CreateRecipePage } from './create-recipe-page';

export function renderCreateRecipePage(this: CreateRecipePage) {
    return html`
        <page-layout>
            <div id="page-container">
                <form id="create-recipe-form" @submit="${(e: SubmitEvent) => this.submit(e)}">
                    <div id="image-ingredients-container">
                        <div id="ingredient-container">
                            <input
                                type="text"
                                id="title"
                                .value="${this.recipe.title}"
                                onclick="javascript:this.select()"
                                @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
                                @change="${(e: Event) => this.changeProperty('title', (e.target as HTMLInputElement).value)}"
                            />
                            ${Object.entries(groupBy(this.recipe.ingredients, 'groupName')).map((group) =>
                                renderIngredientGroup.call(this, group)
                            )}
                            <button tabindex="0" id="add-group-link" @click="${(e: Event) => this.addGroup(e)}">
                                + Gruppe hinzufügen
                            </button>
                        </div>
                        <div id="image-container">
                            <div
                                id="image"
                                ?set="${this.recipe.imageUrl}"
                                style="background-image: url('${this.recipe.imageUrl}')"
                            >
                                <upload-area
                                    @imageReceived="${(e: CustomEvent<{ imageData: string }>) =>
                                        this.notifyImageAdded(e.detail.imageData)}"
                                ></upload-area>
                            </div>

                            <star-rating
                                id="rating"
                                max="5"
                                singleSelect
                                .values="${createRange(0, this.recipe.rating)}"
                                @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                                    this.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                            <star-rating
                                vertical
                                swords
                                id="difficulty"
                                max="5"
                                singleSelect
                                .values="${createRange(0, this.recipe.difficulty)}"
                                @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                                    this.changeProperty('difficulty', e.detail.rating)}"
                            ></star-rating>
                            <div id="nation-icon" nation="${this.recipe.nation}"></div>
                        </div>
                    </div>

                    <div id="description-area">
                        <div class="description-section" id="dropdown-section">
                            <div class="description-input">
                                <div class="input-title">Gang:</div>
                                <drop-down
                                    id="course"
                                    tabindex="0"
                                    .options="${DropDownOption.createSimpleArray(Object.values(Course), this.recipe.course)}"
                                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                        this.changeProperty('course', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Hauptzutat:</div>
                                <drop-down
                                    id="main-ingredient"
                                    tabindex="0"
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(Ingredient),
                                        this.recipe.mainIngredient
                                    )}"
                                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                        this.changeProperty('mainIngredient', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Zubereitungsart:</div>
                                <drop-down
                                    id="technique"
                                    tabindex="0"
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(CookingTechnique),
                                        this.recipe.technique
                                    )}"
                                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                        this.changeProperty('technique', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                        </div>
                        <div class="description-section" id="times-section">
                            <div class="description-input">
                                <div class="input-title">Vorbereitungsdauer:</div>
                                <duration-input
                                    id="preparation-time"
                                    .timespan="${TimeSpan.fromString(this.recipe.preparationTime)}"
                                    @duration-changed="${(e: CustomEvent<string>) =>
                                        this.changeProperty('preparationTime', e.detail)}"
                                ></duration-input>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Kochdauer:</div>
                                <duration-input
                                    id="cooking-time"
                                    .timespan="${TimeSpan.fromString(this.recipe.cookingTime)}"
                                    @duration-changed="${(e: CustomEvent<string>) =>
                                        this.changeProperty('cookingTime', e.detail)}"
                                ></duration-input>
                            </div>
                            <div class="description-input">
                                <div class="input-title">Gesamtdauer:</div>
                                <duration-input
                                    disabled
                                    id="total-time"
                                    .timespan="${TimeSpan.fromString(this.recipe.totalTime)}"
                                    @duration-changed="${(e: CustomEvent<string>) => this.changeProperty('totalTime', e.detail)}"
                                ></duration-input>
                            </div>
                        </div>
                    </div>
                    <textarea
                        id="recipe-text"
                        oninput="this.dispatchEvent(new Event('change'))"
                        @change="${(e: Event) => this.changeProperty('formattedText', (e.target as HTMLInputElement).value)}"
                        .value="${this.recipe.formattedText ?? ''}"
                    >
                    </textarea>
                    <div id="action-area">
                        <input type="button" value="Abbrechen" @click="${() => this.abort()}" />
                        <input type="submit" value="Erstellen" />
                    </div>
                </form>
            </div>
        </page-layout>
    `;
}

function renderIngredientGroup(this: CreateRecipePage, group: [name: string, ingredients: IngredientModel[]]) {
    return html`
        <div id="${group[0]}" class="ingredient-group">
            <input
                type="text"
                class="group-title"
                .value="${group[0]}"
                onclick="javascript:this.select()"
                @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
                @change="${(e: Event) => this.renameGroup(group[1], (e.target as HTMLInputElement).value)}"
            />
            <priority-list
                .items="${group[1]}"
                .itemRenderer="${renderIngredient}"
                @delete-item="${(e: CustomEvent<any>) => this.removeItem(e.detail)}"
            >
            </priority-list>
            <button tabindex="0" id="add-ingredient-link" @click="${(e: Event) => this.addIngredient(group[0], e)}">
                + Zutat hinzufügen
            </button>
        </div>
    `;
}

function renderIngredient(ingredient: IngredientModel) {
    var unit = ingredient['unit'] ?? ExtendedIngredientUnit[ingredient.measurement][0];
    return html` <div class="ingredient">
        <input
            type="text"
            class="ingredient-amount"
            supportedCharacters="[0-9.]"
            .value="${ingredient.amount.toString()}"
            onclick="javascript:this.select()"
            @input="${(e: KeyboardEvent) => handleLabelInput(e, /[0-9.]/g)}"
            @change="${(e: Event) => (ingredient.amount = Number.parseFloat((e.target as HTMLInputElement).value) ?? 0)}"
        />
        <grouped-dropdown
            tabindex="0"
            compact
            .result="${{ category: ingredient.measurement, value: unit }}"
            .options="${ExtendedIngredientUnit}"
            class="ingredient-unit"
            @selectionChange="${(e: CustomEvent<GroupedDropdownResult>) =>
                ([ingredient.measurement, ingredient['unit']] = [e.detail.category as Measurement, e.detail.value])}"
        ></grouped-dropdown>
        <input
            type="text"
            class="ingredient-name"
            .value="${ingredient.name}"
            onclick="javascript:this.select()"
            @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
            @change="${(e: Event) => (ingredient.name = (e.target as HTMLInputElement).value)}"
        />
        <input
            type="text"
            class="ingredient-description"
            .value="${ingredient.description ?? ''}"
            onclick="javascript:this.select()"
            @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
            @change="${(e: Event) => (ingredient.description = (e.target as HTMLInputElement).value)}"
        />
    </div>`;
}

function handleLabelInput(e: KeyboardEvent, supportedCharacters?: RegExp) {
    if (!supportedCharacters || e.key.length != 1 || e.key.match(supportedCharacters)) return;
    (e.target as HTMLInputElement).dispatchEvent(new Event('change'));
    e.stopPropagation();
    e.preventDefault();
}
