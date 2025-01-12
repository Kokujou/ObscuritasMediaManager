import { html } from 'lit-element';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { Session } from '../../data/session';
import { ContextMenu, ContextMenuItem } from '../../native-components/context-menu/context-menu';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { IngredientCategory, IngredientModel, Language } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { IngredientIcons } from '../../resources/inline-icons/ingredient-icons/icon-registry';
import { renderAsianShopLinks } from './asian-shops.html';
import { ShoppingPage } from './shopping-page';

export function renderShoppingPage(this: ShoppingPage) {
    return html`
        <page-layout>
            <table>
                <thead>
                    <tr id="filter-area">
                        <td colspan="6">
                            <div id="filter-header">
                                Suche filtern:
                                <div id="nation-filter" class="filter">
                                    Nationalität:
                                    <drop-down
                                        .options="${DropDownOption.createSimpleArray(Object.values(Language), this.nation)}"
                                        useSearch
                                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<Language> }>) =>
                                            (this.nation = e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                                <div id="category-filter" class="filter">
                                    Kategorie:
                                    <drop-down
                                        .options="${[
                                            DropDownOption.create({
                                                text: 'Unset',
                                                value: null,
                                                state: !this.category ? CheckboxState.Require : CheckboxState.Forbid,
                                            }),
                                            ...DropDownOption.createSimpleArray(Object.values(IngredientCategory), this.category),
                                        ]}"
                                        useSearch
                                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<IngredientCategory> }>) =>
                                            (this.category = e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                                <div id="search-container" class="filter">
                                    <div class="icon" icon="${Icons.Search}"></div>
                                    <input
                                        id="search-input"
                                        placeholder="Suchbegriff eingeben..."
                                        @input="${(e: Event) => (this.searchText = (e.target as HTMLInputElement).value)}"
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="table-head-cell">
                        <td style="width: auto">Zutat</td>
                        <td>Bester Preis</td>
                        <td>Nationalität</td>
                        <td style="width: 300px">Kategorie</td>
                        <td>Shops</td>
                        <td>Aktionen</td>
                    </tr>
                </thead>
                <tr>
                    <td colspan="6" align="center">
                        <div id="create-ingredient-link" @click="${() => this.createIngredient()}">Zutat erstellen</div>
                    </td>
                </tr>
                ${this.filteredIngredients.map((ingredient) => renderIngredient.call(this, ingredient))}
            </table>
        </page-layout>
    `;
}

function renderIngredient(this: ShoppingPage, ingredient: IngredientModel) {
    return html` <tr
        ?new="${this.newIngredients.includes(ingredient.ingredientName)}"
        ?favorite="${Session.favoriteIngredients.includes(ingredient.ingredientName)}"
    >
        <td>${ingredient?.ingredientName ?? html` <input class="ingredient-name" /> `}</td>
        <td>
            <input
                class="ingredient-price"
                .value="${ingredient.lowestKnownPrice.toString()}"
                placeholder="---"
                @change="${(e: Event) =>
                    this.updateIngredient(ingredient, 'lowestKnownPrice', (e.target as HTMLInputElement).value)}"
            />
        </td>
        <td>
            <drop-down
                class="ingredient-nation"
                .options="${DropDownOption.createSimpleArray(Object.values(Language), ingredient.nation)}"
                useSearch
                @selectionChange="${(e: CustomEvent<{ option: DropDownOption<Language> }>) =>
                    this.updateIngredient(ingredient, 'nation', e.detail.option.value)}"
            ></drop-down>
        </td>
        <td>
            <div class="ingredient-category">
                <div class="category-text">${ingredient.category ?? IngredientCategory.Miscellaneous}</div>
                <div
                    class="ingredient-category-icon-wrapper"
                    tabindex="0"
                    onkeydown="javascript: if(event.key == 'Enter' || event.key == ' ') { 
                                                event.preventDefault(); 
                                                event.stopPropagation();
                                                this.dispatchEvent(new CustomEvent('click'));
                                            }"
                    @click="${(e: Event) =>
                        ContextMenu.popup(
                            Object.values(IngredientCategory)
                                .filter((x) => x != ingredient.category)
                                .map(
                                    (category) =>
                                        ({
                                            text: category,
                                            image: IngredientIcons[category],
                                            action: () => this.updateIngredient(ingredient, 'category', category),
                                        } as ContextMenuItem)
                                ),
                            e
                        )}"
                >
                    <div class="ingredient-category-icon" icon="${Icons.Category}"></div>
                </div>
            </div>
        </td>
        <td>${renderShopIcons(ingredient)}</td>
        <td>
            <div class="action-icon" icon="${Icons.Star}" @click="${() => this.markAsFavorite(ingredient)}"></div>
        </td>
    </tr>`;
}

function renderShopIcons(ingredient: IngredientModel) {
    switch (ingredient.nation) {
        case Language.Japanese:
        case Language.Chinese:
            return renderAsianShopLinks(ingredient);
    }
}
