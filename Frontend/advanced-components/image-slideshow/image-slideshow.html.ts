import { html } from 'lit';
import { ImportFoodPage } from '../../pages/import-food-page/import-food-page';
import { Icons } from '../../resources/inline-icons/icon-registry';
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
                        @click="${(e: Event) => e.stopPropagation()}"
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
            <side-scroller
                .currentItemIndex="${this.currentIndex}"
                @change="${async () => await this.changeCurrentImage()}"
                @click="${(e: Event) => e.stopPropagation()}"
            >
                ${this.images.map(
                    (image, i) =>
                        html` <div class="imported-image-container" ?current="${this.currentIndex == i}">
                            <img class="imported-image-background" src="${image.thumbData ?? ''}" />
                            <img
                                class="imported-image"
                                src="${image.thumbData ?? ''}"
                                @click="${() => this.sideScroller!.setIndex(i)}"
                                @error="${() => this.notifyThumbError(image.id)}"
                                id="${image.id}"
                            />
                            <img hidden src="${image.imageData ?? ''}" />
                            <div class="remove-image-icon" @click="${() => this.notifyImageRemoved(image.id)}">&times;</div>
                        </div>`,
                )}
                ${this.allowAdd
                    ? html`<div
                          id="add-image-button"
                          noScroll
                          icon="${Icons.Plus}"
                          @click="${() => this.notifyAddImage()}"
                      ></div> `
                    : ''}
            </side-scroller>
            <div id="file-count">${this.totalCount ?? this.images.length} Bilder gefunden...</div>
        </div>
    `;
}
