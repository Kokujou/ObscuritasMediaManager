import { html } from 'lit-element';
import { StarRating } from '../../advanced-components/star-rating/star-rating';
import { MeasurementUnits, ValuelessMeasurements } from '../../data/measurement-units';
import { TimeSpan } from '../../data/timespan';

import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { ContextMenu, ContextMenuItem } from '../../native-components/context-menu/context-menu';
import { GroupedDropdownResult } from '../../native-components/grouped-dropdown/grouped-dropdown';
import { IngredientCategory, IngredientModel, RecipeIngredientMappingModel } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { IngredientIcons } from '../../resources/inline-icons/ingredient-icons/icon-registry';
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
                        ${Object.entries(this.recipe.ingredients.groupByKey('groupName')).map((group) =>
                            renderIngredientGroup.call(this, group)
                        )}
                        <button tabindex="0" id="add-group-link" @click="${(e: Event) => this.addIngredient('Neue Gruppe', e)}">
                            + Gruppe hinzufügen
                        </button>
                        <div id="cooking-utensil-heading">Kochutensilien:</div>
                        <div id="cookware">
                            ${this.recipe.cookware.map(
                                (cookware) =>
                                    html` <div class="cookware-row">
                                        <autocomplete-input
                                            class="cookware-input"
                                            .value="${{ id: cookware.name, text: cookware.name }}"
                                            .searchItems="${this.searchCookware}"
                                            @value-changed="${(e: CustomEvent<AutocompleteItem>) =>
                                                this.updateCookware(cookware, e.detail.id!)}"
                                        ></autocomplete-input>
                                        <div
                                            class="remove-cookware-icon"
                                            icon="${Icons.Trash}"
                                            @click="${() => this.removeCookware(cookware)}"
                                        ></div>
                                    </div>`
                            )}
                        </div>
                        <button
                            tabindex="0"
                            id="add-cookware-link"
                            @click="${(e: Event) => this.addCookware()}"
                            @keyup="${(e: KeyboardEvent) => {
                                if (e.key == 'Enter') e.target?.dispatchEvent(new Event('click'));
                            }}"
                        >
                            + Kochutensil hinzufügen
                        </button>
                    </div>
                    <recipe-tile
                        .recipe="${this.recipe}"
                        compact
                        @imageReceived="${(e: CustomEvent<{ imageData: string }>) =>
                            this.changeProperty('imageData', e.detail.imageData)}"
                        @remove-image="${() => this.changeProperty('imageData', null)}"
                        @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                            (e.composedPath()[0] as StarRating).swords
                                ? this.changeProperty('difficulty', e.detail.rating)
                                : this.changeProperty('rating', e.detail.rating)}"
                    ></recipe-tile>
                </div>

                <div id="description-area">
                    <div class="description-section" id="dropdown-section">
                        <div class="description-input">
                            <div class="input-title">Vorbereitung:</div>
                            <duration-input
                                id="preparation-time"
                                .timespan="${TimeSpan.fromString(this.recipe.preparationTime)}"
                                compact
                                @duration-changed="${(e: CustomEvent<string>) =>
                                    this.changeProperty('preparationTime', e.detail)}"
                            ></duration-input>
                        </div>
                        <div class="description-input">
                            <div class="input-title">Kochen:</div>
                            <duration-input
                                id="cooking-time"
                                .timespan="${TimeSpan.fromString(this.recipe.cookingTime)}"
                                compact
                                @duration-changed="${(e: CustomEvent<string>) => this.changeProperty('cookingTime', e.detail)}"
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
                @delete-item="${(e: CustomEvent<any>) => this.removeIngredient(e.detail)}"
                @list-changed="${() => this.changeProperty('ingredients', this.recipe.ingredients)}"
            >
            </priority-list>
            <button tabindex="0" id="add-ingredient-link" @click="${(e: Event) => this.addIngredient(group[0], e)}">
                + Zutat hinzufügen
            </button>
        </div>
    `;
}

function renderIngredient(this: RecipeDetailPage, ingredient: RecipeIngredientMappingModel) {
    return html` <div class="ingredient" @change="${() => this.changeProperty('ingredients', this.recipe.ingredients)}">
        ${!ValuelessMeasurements.includes(ingredient.unit.measurement)
            ? html` <input
                  type="text"
                  class="ingredient-amount"
                  supportedCharacters="[0-9.]"
                  .value="${ingredient.amount.toString()}"
                  onclick="javascript:this.select()"
                  @input="${(e: KeyboardEvent) => handleLabelInput(e, /[0-9.]/g)}"
                  @change="${(e: Event) => (ingredient.amount = Number.parseFloat((e.target as HTMLInputElement).value) ?? 0)}"
              />`
            : ''}

        <grouped-dropdown
            tabindex="0"
            compact
            .result="${{ category: ingredient.unit.measurement, value: ingredient.unit.name }}"
            .options="${MeasurementUnits.groupAndSelectBy('measurement', 'name')}"
            class="ingredient-unit"
            @selectionChange="${(e: CustomEvent<GroupedDropdownResult>) =>
                this.changeIngredientUnit(ingredient, e.detail.value!)}"
        ></grouped-dropdown>
        <autocomplete-input
            type="text"
            class="ingredient-name"
            .value="${{ id: ingredient.ingredientName, text: ingredient.ingredientName }}"
            .searchItems="${(search: string) => this.searchIngredients(search)}"
            @value-changed="${(e: CustomEvent<AutocompleteItem & IngredientModel>) =>
                this.updateIngredient(ingredient, e.detail)}"
        ></autocomplete-input>
        <input
            type="text"
            class="ingredient-description"
            .value="${ingredient.description ?? ''}"
            onclick="javascript:this.select()"
            @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
            @change="${(e: Event) => (ingredient.description = (e.target as HTMLInputElement).value)}"
        />
        <div class="ingredient-category">${ingredient.ingredient?.category ?? IngredientCategory.Miscellaneous}</div>
        <div
            class="ingredient-category-icon-wrapper"
            tabindex="0"
            onkeydown="javascript: if(event.key == 'Enter' || event.key == ' ') 
            { 
                event.preventDefault(); 
                event.stopPropagation();
                this.dispatchEvent(new CustomEvent('click'));
            }"
            @click="${(e: Event) =>
                ContextMenu.popup(
                    Object.values(IngredientCategory)
                        .filter((x) => x != ingredient.ingredient?.category)
                        .map(
                            (category) =>
                                ({
                                    text: category,
                                    image: IngredientIcons[category],
                                    action: () => this.changeIngredientCategory(ingredient, category),
                                } as ContextMenuItem)
                        ),
                    e
                )}"
        >
            <div class="ingredient-category-icon" icon="${Icons.Category}"></div>
        </div>
    </div>`;
}

function handleLabelInput(e: KeyboardEvent, supportedCharacters?: RegExp) {
    if (!supportedCharacters || e.key.length != 1 || e.key.match(supportedCharacters)) return;
    (e.target as HTMLInputElement).dispatchEvent(new Event('change'));
    e.stopPropagation();
    e.preventDefault();
}
