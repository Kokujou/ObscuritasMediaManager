import { html } from 'lit';
import { SlideshowImage } from '../../advanced-components/image-slideshow/slideshow-image';
import { ColoredFoodTags } from '../../data/food/food-tags';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { FoodModel, FoodTagModel } from '../../obscuritas-media-manager-backend-client';
import { FoodCache, ImportFoodPage } from './import-food-page';

//Note: it is important to specify .currentIndex before events
ImportFoodPage.prototype.render = function renderImportFoodPage(this: ImportFoodPage) {
    if (!this.initialized) return;
    return html`
        <div id="page">
            <image-slideshow
                @image-changing="${async (e: CustomEvent<string>) => {
                    if (e.detail)
                        await FoodCache.updateMetadata(this.paginatedFiles.find((x) => x.recipe.id == e.detail)!.recipe);
                }}"
                @image-changed="${(e: CustomEvent<string>) => this.changeCurrentImage(e.detail)}"
                @image-error="${(e: CustomEvent<string>) =>
                    this.reloadImage(this.paginatedFiles.find((x) => x.recipe.id == e.detail)!)}"
                @thumb-error="${(e: CustomEvent<string>) =>
                    this.reloadThumb(this.paginatedFiles.find((x) => x.recipe.id == e.detail)!)}"
                @image-removed="${(e: CustomEvent<string>) =>
                    this.removeDish(this.paginatedFiles.find((x) => x.recipe.id == e.detail)!)}"
                @scroll-to-end="${async () => await this.loadMoreImages()}"
                .images="${this.paginatedFiles.map(
                    (file) => new SlideshowImage(file.recipe.id, file.image.image.imageData, file.image.thumb.thumbData),
                )}"
                .totalCount="${FoodCache.length}"
                .currentIndex="${this.index ?? 0}"
            >
                ${this.currentDish
                    ? html`
                          <div
                              slot="edit-sidebar"
                              id="edit-image-sidebar"
                              @change="${() => FoodCache.updateMetadata(this.currentDish.recipe)}"
                              @keyup="${(e: KeyboardEvent) => {
                                  if (e.key == 'Escape') this.focus();
                                  e.stopPropagation();
                              }}"
                          >
                              <autocomplete-input
                                  id="food-name"
                                  allowText
                                  placeholder="Name des Gerichts..."
                                  .value="${{ text: this.currentDish.recipe.title ?? '', id: null }}"
                                  .searchItems="${(search: string) => this.searchDishes(search)}"
                                  @value-changed="${async (e: CustomEvent<AutocompleteItem>) => {
                                      this.currentDish.recipe.title = e.detail.text;
                                      if (e.detail.id) this.applySearchResult(e.detail as any as FoodModel);
                                  }}"
                              ></autocomplete-input>
                              <textarea
                                  type="text"
                                  id="food-description"
                                  rows="4"
                                  placeholder="Beschreibung des Gerichts..."
                                  .value="${this.currentDish.recipe.description ?? ''}"
                                  value="${this.currentDish.recipe.description ?? ''}"
                                  @input="${(e: Event) =>
                                      (this.currentDish.recipe.description = (e.target as HTMLInputElement).value)}"
                              ></textarea>
                              <star-rating
                                  max="5"
                                  .values="${Array.createRange(1, this.currentDish.recipe.rating ?? 0)}"
                                  singleSelect
                                  @ratingChanged="${(e: CustomEvent) => (this.currentDish.recipe.rating = e.detail.rating)}"
                              ></star-rating>
                              <star-rating
                                  swords
                                  max="5"
                                  .values="${Array.createRange(1, this.currentDish.recipe.difficulty ?? 0)}"
                                  singleSelect
                                  @ratingChanged="${(e: CustomEvent) => (this.currentDish.recipe.difficulty = e.detail.rating)}"
                              ></star-rating>
                              <label>Tags:</label>
                              <drop-down
                                  .options="${ColoredFoodTags.filter(
                                      (tag) => !this.currentDish.recipe.tags.some((existing) => tag.value == existing.value),
                                  ).map((tag) => DropDownOption.create({ category: tag.key, text: tag.value, value: tag }))}"
                                  caption="Neuen Tag auswählen"
                                  useSearch
                                  @selectionChange="${(e: CustomEvent<{ option: DropDownOption<FoodTagModel> }>) => {
                                      this.currentDish.recipe.tags.push(e.detail.option.value);
                                      this.requestFullUpdate();
                                  }}"
                              ></drop-down>
                              <div id="tags">
                                  ${ColoredFoodTags.filter((tag) =>
                                      this.currentDish.recipe.tags.some((existing) => existing.value == tag.value),
                                  )
                                      .orderBy((x) => x.key)
                                      .map(
                                          (tag) =>
                                              html`<tag-label
                                                  .text="${`${tag.key}: ${tag.value}`}"
                                                  style="--label-color: ${tag.color}"
                                                  @removed="${() => {
                                                      this.currentDish.recipe.tags = this.currentDish.recipe.tags.filter(
                                                          (x) => x.value != tag.value,
                                                      );
                                                      this.requestFullUpdate();
                                                  }}"
                                              ></tag-label>`,
                                      )}
                              </div>
                          </div>
                      `
                    : ''}
            </image-slideshow>

            <div id="finish-import-button" @click="${async () => await this.importFiles()}">
                <div id="finish-import-icon"></div>
            </div>
        </div>
    `;
};
