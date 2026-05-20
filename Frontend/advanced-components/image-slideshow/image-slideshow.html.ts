import { html } from 'lit';
import { FoodCache, ImportFoodPage } from '../../pages/import-food-page/import-food-page';
import { ImageSlideshow } from './image-slideshow';

export function renderImageSlideshow(this: ImageSlideshow) {
    return html`
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
                        src="${this.currentImage?.imageData ?? ''}"
                        style="aspect-ratio: ${this.currentAspectRatio}; ${this.currentAspectRatio > 1
                            ? 'width: 100%;'
                            : 'height: 100%'}"
                        @load="${() => this.requestFullUpdate()}"
                        @error="${() => (this.currentImage?.id ? this.notifyImageError(this.currentImage.id) : null)}"
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
            <slot name="edit-sidebar"></slot>
            <side-scroller @change="${async () => await this.changeCurrentImage()}">
                ${this.images.map(
                    (image, i) =>
                        html` <div class="imported-image-container" ?current="${this.currentIndex == i}">
                            <img class="imported-image-background" src="${image.imageData ?? ''}" />
                            <img
                                class="imported-image"
                                src="${image.imageData ?? ''}"
                                @click="${() => this.sideScroller!.setIndex(i)}"
                                @error="${() => this.notifyThumbError(image.id)}"
                                id="${image.id}"
                            />
                            <div class="remove-image-icon" @click="${() => this.notifyImageRemoved(image.id)}">&times;</div>
                        </div>`,
                )}
            </side-scroller>
            <div id="file-count">${FoodCache.length} Bilder gefunden...</div>
        </div>
    `;
}
