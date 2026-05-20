import { html } from 'lit';
import { MeasurementUnits, ValuelessMeasurements } from '../../data/measurement-units';

import { StarRating } from '../../advanced-components/star-rating/star-rating';
import { ColoredFoodTags } from '../../data/food/food-tags';
import { TimeSpan } from '../../data/timespan';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { ContextMenu, ContextMenuItem } from '../../native-components/context-menu/context-menu';
import { GroupedDropdownResult } from '../../native-components/grouped-dropdown/grouped-dropdown';
import {
    FoodTagModel,
    IngredientCategory,
    IngredientModel,
    RecipeIngredientMappingModel,
} from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { IngredientIcons } from '../../resources/inline-icons/ingredient-icons/icon-registry';
import { RecipeDetailPage } from './recipe-detail-page';

export function renderRecipeDetailPage(this: RecipeDetailPage) {
    return html`
        <page-layout>
            <div id="page-container">
                <flex-row id="basic-info-section">
                    <recipe-tile
                        .recipe="${this.recipe}"
                        @imageReceived="${(e: CustomEvent<{ imageData: string }>) => this.addImage(e.detail.imageData)}"
                        @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                            (e.composedPath()[0] as StarRating).swords
                                ? this.changeBaseProperty('difficulty', e.detail.rating)
                                : this.changeBaseProperty('rating', e.detail.rating)}"
                        @click="${() => this.showSlideshow()}"
                    ></recipe-tile>
                    <flex-column id="heading-section">
                        <input
                            type="text"
                            id="title"
                            .value="${this.recipe.title}"
                            @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
                            @change="${(e: Event) => this.changeBaseProperty('title', (e.target as HTMLInputElement).value)}"
                        />
                        <textarea
                            id="description"
                            .value="${this.recipe.description}"
                            @input="${(e: KeyboardEvent) => handleLabelInput(e)}"
                            @change="${(e: Event) =>
                                this.changeBaseProperty('description', (e.target as HTMLTextAreaElement).value)}"
                        ></textarea>
                        <flex-row id="food-tags">
                            ${ColoredFoodTags.filter((tag) => this.recipe.tags.some((existing) => existing.value == tag.value))
                                .orderBy((x) => x.key)
                                .map(
                                    (tag) =>
                                        html`<tag-label
                                            .text="${`${tag.key}: ${tag.value}`}"
                                            style="--label-color: ${tag.color}"
                                            @removed="${() => this.removeTag(tag)}"
                                        ></tag-label>`,
                                )}
                            <tag-label
                                createNew
                                withGroups
                                .groups="${ColoredFoodTags.orderBy((x) => x.key).map((x) => [x.key, x.value] as const)}"
                                @tagCreated="${(e: CustomEvent<{ value: string; group?: string }>) =>
                                    this.addTag(
                                        new FoodTagModel({
                                            recipeId: this.recipe.id,
                                            key: e.detail.group!,
                                            value: e.detail.value,
                                        }),
                                    )}"
                            ></tag-label>
                        </flex-row>
                        ${!this.fullRecipe
                            ? html` <div id="add-recipe-button" @click="${() => this.addRecipe()}">Rezept hinzufügen</div> `
                            : ''}
                    </flex-column>
                </flex-row>
                ${renderRecipeSection.call(this)}
            </div>
        </page-layout>
    `;
}

function renderRecipeSection(this: RecipeDetailPage) {
    if (!this.fullRecipe) return;

    return html`
        <div id="image-ingredients-container">
            <div id="ingredient-container">
                ${Object.entries(this.fullRecipe.ingredients.groupByKey('groupName')).map((group) =>
                    renderIngredientGroup.call(this, group),
                )}
                <button tabindex="0" id="add-group-link" @click="${(e: Event) => this.addIngredient('Neue Gruppe', e)}">
                    + Gruppe hinzufügen
                </button>
                <div id="cooking-utensil-heading">Kochutensilien:</div>
                <div id="cookware">
                    ${this.fullRecipe.cookware.map(
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
                            </div>`,
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
        </div>

        <div id="description-area">
            <div class="description-section" id="dropdown-section">
                <div class="description-input">
                    <div class="input-title">Vorbereitung:</div>
                    <duration-input
                        id="preparation-time"
                        .timespan="${TimeSpan.fromString(this.fullRecipe.preparationTime)}"
                        compact
                        @duration-changed="${(e: CustomEvent<string>) => this.changeProperty('preparationTime', e.detail)}"
                    ></duration-input>
                </div>
                <div class="description-input">
                    <div class="input-title">Kochen:</div>
                    <duration-input
                        id="cooking-time"
                        .timespan="${TimeSpan.fromString(this.fullRecipe.cookingTime)}"
                        compact
                        @duration-changed="${(e: CustomEvent<string>) => this.changeProperty('cookingTime', e.detail)}"
                    ></duration-input>
                </div>
            </div>
            <textarea
                id="recipe-text"
                oninput="this.dispatchEvent(new Event('change'))"
                @change="${(e: Event) => this.changeProperty('recipeText', (e.target as HTMLInputElement).value)}"
                .value="${this.fullRecipe.recipeText ?? ''}"
            >
            </textarea>
        </div>

        <div id="action-area">
            ${!this.recipe.id ? html` <div class="action-button" @click="${() => this.createRecipe()}">Erstellen</div> ` : ''}
        </div>
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
                @list-changed="${() => this.changeProperty('ingredients', this.fullRecipe!.ingredients)}"
            >
            </priority-list>
            <button tabindex="0" id="add-ingredient-link" @click="${(e: Event) => this.addIngredient(group[0], e)}">
                + Zutat hinzufügen
            </button>
        </div>
    `;
}

function renderIngredient(this: RecipeDetailPage, ingredient: RecipeIngredientMappingModel) {
    return html` <div class="ingredient" @change="${() => this.changeProperty('ingredients', this.fullRecipe!.ingredients)}">
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
                                }) as ContextMenuItem,
                        ),
                    e,
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
