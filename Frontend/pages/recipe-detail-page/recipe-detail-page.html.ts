import { html } from 'lit-element';
import { StarRating } from '../../advanced-components/star-rating/star-rating';
import { MeasurementUnits } from '../../data/measurement-units';
import { TimeSpan } from '../../data/timespan';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { GroupedDropdownResult } from '../../native-components/grouped-dropdown/grouped-dropdown';
import { CookingTechnique, Course, RecipeIngredientMappingModel } from '../../obscuritas-media-manager-backend-client';
import { groupAndSelectBy, groupBy } from '../../services/extensions/array.extensions';
import { RecipeDetailPage } from './recipe-detail-page';

export function renderRecipeDetailPage(this: RecipeDetailPage) {
    return html`
        <page-layout>
            <div id="page-container">
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
                        <button tabindex="0" id="add-group-link" @click="${(e: Event) => this.addIngredient('Neue Gruppe', e)}">
                            + Gruppe hinzufügen
                        </button>
                    </div>
                    <recipe-tile
                        .recipe="${this.recipe}"
                        compact
                        @change-nation="${() => this.changeNation()}"
                        @imageReceived="${(e: CustomEvent<{ imageData: string }>) =>
                            this.changeProperty('imageUrl', e.detail.imageData)}"
                        @remove-image="${() => this.changeProperty('imageUrl', null)}"
                        @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                            (e.composedPath()[0] as StarRating).swords
                                ? this.changeProperty('difficulty', e.detail.rating)
                                : this.changeProperty('rating', e.detail.rating)}"
                    ></recipe-tile>
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
                                @duration-changed="${(e: CustomEvent<string>) => this.changeProperty('cookingTime', e.detail)}"
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
                    <textarea
                        id="recipe-text"
                        oninput="this.dispatchEvent(new Event('change'))"
                        @change="${(e: Event) => this.changeProperty('formattedText', (e.target as HTMLInputElement).value)}"
                        .value="${this.recipe.formattedText ?? ''}"
                    >
                    </textarea>
                </div>

                <div id="action-area">
                    ${!this.recipe.id
                        ? html` <div class="action-button" @click="${() => this.createRecipe()}">Erstellen</div> `
                        : ''}
                </div>
            </div>
        </page-layout>
    `;
}

function renderIngredientGroup(this: RecipeDetailPage, group: [name: string, ingredients: RecipeIngredientMappingModel[]]) {
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
                .itemRenderer="${(item: RecipeIngredientMappingModel) => renderIngredient.call(this, item)}"
                @delete-item="${(e: CustomEvent<any>) => this.removeItem(e.detail)}"
            >
            </priority-list>
            <button tabindex="0" id="add-ingredient-link" @click="${(e: Event) => this.addIngredient(group[0], e)}">
                + Zutat hinzufügen
            </button>
        </div>
    `;
}

function renderIngredient(this: RecipeDetailPage, ingredient: RecipeIngredientMappingModel) {
    const ingredient2 = ingredient;
    return html` <div class="ingredient" @change="${() => this.changeProperty('ingredients', this.recipe.ingredients)}">
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
            .result="${{ category: ingredient.unit.measurement, value: ingredient.unit.name }}"
            .options="${groupAndSelectBy(MeasurementUnits, 'measurement', 'name')}"
            class="ingredient-unit"
            @selectionChange="${(e: CustomEvent<GroupedDropdownResult>) =>
                this.changeIngredientUnit(ingredient2, e.detail.value!)}"
        ></grouped-dropdown>
        <input
            type="text"
            class="ingredient-name"
            .value="${ingredient.ingredientName}"
            onclick="javascript:this.select()"
            @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
            @change="${(e: Event) => (ingredient.ingredientName = (e.target as HTMLInputElement).value)}"
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
