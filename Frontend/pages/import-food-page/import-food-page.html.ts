import { html } from 'lit-element';
import { ColoredFoodTags } from '../../data/food/food-tags';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { FoodTagModel } from '../../obscuritas-media-manager-backend-client';
import { ImportFoodPage } from './import-food-page';

ImportFoodPage.prototype.render = function renderImportFoodPage(this: ImportFoodPage) {
    return html`
        <div id="page">
            <div id="current-image-editor">
                <img id="current-image" src="${this.currentImage.imageData!}" />
                <div
                    id="edit-image-sidebar"
                    @change="${() => ImportFoodPage.cacheMetadata(this.sideScroller.currentItemIndex, this.currentImage)}"
                >
                    <autocomplete-input
                        id="food-name"
                        allowText
                        placeholder="Name des Gerichts..."
                        .value="${{ text: this.currentImage.title ?? '', id: null }}"
                        .searchItems="${(search: string) => this.searchDishes(search)}"
                        @value-changed="${(e: CustomEvent<AutocompleteItem>) => (this.currentImage.title = e.detail.text)}"
                    ></autocomplete-input>
                    <textarea
                        type="text"
                        id="food-description"
                        rows="4"
                        placeholder="Beschreibung des Gerichts..."
                        .value="${this.currentImage.description ?? ''}"
                        @change="${(e: Event) => (this.currentImage.description = (e.target as HTMLInputElement).value)}"
                    ></textarea>
                    <star-rating
                        max="5"
                        .values="${Array.createRange(1, this.currentImage.rating ?? 0)}"
                        singleSelect
                        @ratingChanged="${(e: CustomEvent) => (this.currentImage.rating = e.detail.rating)}"
                    ></star-rating>
                    <star-rating
                        swords
                        max="5"
                        .values="${Array.createRange(1, this.currentImage.difficulty ?? 0)}"
                        singleSelect
                        @ratingChanged="${(e: CustomEvent) => (this.currentImage.difficulty = e.detail.rating)}"
                    ></star-rating>
                    <label>Tags:</label>
                    <drop-down
                        .options="${ColoredFoodTags.filter(
                            (tag) => !this.currentImage.tags.some((existing) => tag.value == existing.value)
                        ).map((tag) => DropDownOption.create({ category: tag.key, text: tag.value, value: tag }))}"
                        caption="Neuen Tag auswählen"
                        useSearch
                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<FoodTagModel> }>) => {
                            this.currentImage.tags.push(e.detail.option.value);
                            this.requestFullUpdate();
                        }}"
                    ></drop-down>
                    <div id="tags">
                        ${ColoredFoodTags.filter((tag) => this.currentImage.tags.some((existing) => existing.value == tag.value))
                            .orderBy((x) => x.key)
                            .map(
                                (tag) =>
                                    html`<tag-label
                                        .text="${`${tag.key}: ${tag.value}`}"
                                        style="--label-color: ${tag.color}"
                                    ></tag-label>`
                            )}
                    </div>
                </div>
                <side-scroller
                    @change="${async () => {
                        if (this.sideScroller.currentItemIndex >= this.paginatedFiles.length - 5) await this.loadMoreImages();
                        await this.changeCurrentImage();
                    }}"
                >
                    ${this.paginatedFiles.map(
                        (file, i) => html` <div
                            class="imported-image-container"
                            ?current="${this.sideScroller?.currentItemIndex == i}"
                        >
                            <img class="imported-image" src="${file}" @click="${() => this.sideScroller.setIndex(i)}" />
                            <div class="remove-image-icon" @click="${() => this.removeImageAt(i)}">&times;</div>
                        </div>`
                    )}
                </side-scroller>
            </div>

            <div id="finish-import-button" @click="${async () => await this.importFiles()}">
                <div id="finish-import-icon"></div>
            </div>
        </div>
    `;
};
