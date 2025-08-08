import { html } from 'lit-element';
import { ColoredFoodTags } from '../../data/food/food-tags';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { FoodModel, FoodTagModel } from '../../obscuritas-media-manager-backend-client';
import { FoodCache, ImportFoodPage } from './import-food-page';

ImportFoodPage.prototype.render = function renderImportFoodPage(this: ImportFoodPage) {
    if (!this.currentDish) return null;
    return html`
        <div id="page">
            <div id="current-image-editor">
                <div id="current-image-background">
                    <div
                        id="current-image-container"
                        style="aspect-ratio: ${this.currentAspectRatio}; ${this.currentAspectRatio > 1
                            ? 'width: 100%;'
                            : 'height: 100%'}"
                    >
                        <img
                            id="current-image"
                            src="${this.currentDish.image.imageData!}"
                            style="aspect-ratio: ${this.currentAspectRatio}; ${this.currentAspectRatio > 1
                                ? 'width: 100%;'
                                : 'height: 100%'}"
                            @load="${() => this.requestFullUpdate()}"
                            @error="${() => this.reloadImage(this.currentDish)}"
                        />
                        ${ImportFoodPage.caching.current() || this.loading
                            ? html`
                                  <div id="cache-loading-indicator">
                                      <partial-loading hideText full-width></partial-loading>
                                      <div class="loading-text">Cache lädt...</div>
                                  </div>
                              `
                            : ''}
                    </div>
                </div>
                <div
                    id="edit-image-sidebar"
                    @change="${() => FoodCache.updateMetadata(this.currentDish)}"
                    @keyup="${(e: KeyboardEvent) => {
                        if (e.key == 'Escape') this.focus();
                        e.stopPropagation();
                    }}"
                >
                    <autocomplete-input
                        id="food-name"
                        allowText
                        placeholder="Name des Gerichts..."
                        .value="${{ text: this.currentDish.title ?? '', id: null }}"
                        .searchItems="${(search: string) => this.searchDishes(search)}"
                        @value-changed="${async (e: CustomEvent<AutocompleteItem>) => {
                            this.currentDish.title = e.detail.text;
                            if (e.detail.id) this.applySearchResult(e.detail as any as FoodModel);

                            await this.changeCurrentImage();
                        }}"
                    ></autocomplete-input>
                    <textarea
                        type="text"
                        id="food-description"
                        rows="4"
                        placeholder="Beschreibung des Gerichts..."
                        .value="${this.currentDish.description ?? ''}"
                        value="${this.currentDish.description ?? ''}"
                        @input="${(e: Event) => (this.currentDish.description = (e.target as HTMLInputElement).value)}"
                    ></textarea>
                    <star-rating
                        max="5"
                        .values="${Array.createRange(1, this.currentDish.rating ?? 0)}"
                        singleSelect
                        @ratingChanged="${(e: CustomEvent) => (this.currentDish.rating = e.detail.rating)}"
                    ></star-rating>
                    <star-rating
                        swords
                        max="5"
                        .values="${Array.createRange(1, this.currentDish.difficulty ?? 0)}"
                        singleSelect
                        @ratingChanged="${(e: CustomEvent) => (this.currentDish.difficulty = e.detail.rating)}"
                    ></star-rating>
                    <label>Tags:</label>
                    <drop-down
                        .options="${ColoredFoodTags.filter(
                            (tag) => !this.currentDish.tags.some((existing) => tag.value == existing.value)
                        ).map((tag) => DropDownOption.create({ category: tag.key, text: tag.value, value: tag }))}"
                        caption="Neuen Tag auswählen"
                        useSearch
                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<FoodTagModel> }>) => {
                            this.currentDish.tags.push(e.detail.option.value);
                            this.requestFullUpdate();
                        }}"
                    ></drop-down>
                    <div id="tags">
                        ${ColoredFoodTags.filter((tag) => this.currentDish.tags.some((existing) => existing.value == tag.value))
                            .orderBy((x) => x.key)
                            .map(
                                (tag) =>
                                    html`<tag-label
                                        .text="${`${tag.key}: ${tag.value}`}"
                                        style="--label-color: ${tag.color}"
                                        @removed="${() => {
                                            this.currentDish.tags = this.currentDish.tags.filter((x) => x.value != tag.value);
                                            this.requestFullUpdate();
                                        }}"
                                    ></tag-label>`
                            )}
                    </div>
                </div>
                <side-scroller @change="${async () => await this.changeCurrentImage()}">
                    ${this.paginatedFiles.map(
                        (dish, i) => html` <div
                            class="imported-image-container"
                            ?current="${this.sideScroller?.currentItemIndex == i}"
                        >
                            <img
                                class="imported-image"
                                src="${dish.image.imageData!}"
                                @click="${() => this.sideScroller!.setIndex(i)}"
                                @error="${() => this.reloadThumb(dish)}"
                            />
                            <div class="remove-image-icon" @click="${() => this.removeDish(dish)}">&times;</div>
                        </div>`
                    )}
                </side-scroller>
                <div id="file-count">${FoodCache.length} Bilder gefunden...</div>
            </div>

            <div id="finish-import-button" @click="${async () => await this.importFiles()}">
                <div id="finish-import-icon"></div>
            </div>
        </div>
    `;
};
