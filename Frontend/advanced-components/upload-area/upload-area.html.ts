import { html } from 'lit';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { UploadArea } from './upload-area';

export function renderUploadArea(this: UploadArea) {
    const images = (this.images ?? []).concat(this.tempImages);
    const firstImage = images[0];
    const otherImages = images.slice(1);

    return html`
        <div
            id="image-container"
            tabindex="0"
            ?inert="${this.disabled}"
            @drop="${(e: DragEvent) => this.receiveDroppedImage(e)}"
            @dragover="${(e: DragEvent) => this.dragOver(e)}"
            @dragleave="${(e: DragEvent) => this.dragLeave(e)}"
            @pointerdown="${(e: Event) => e.preventDefault()}"
        >
            ${this.noImage || !firstImage
                ? html`
                      <div
                          id="add-icon"
                          class="icon"
                          icon="${Icons.Plus}"
                          @pointerdown=${(e: Event) => this.setFocusToContainer(e)}
                      ></div>
                  `
                : html` <img
                      class="image"
                      decoding="async"
                      src="${firstImage}"
                      style="transform: scale(0.9); filter: drop-shadow(0 0 20px black) drop-shadow(0 0 20px black);'"
                      @click="${() => this.notifyImageClicked()}"
                  />`}
            ${otherImages.length < 2
                ? ''
                : otherImages.map(
                      (image, index) => html`
                          <img
                              class="image"
                              decoding="async"
                              src="${image}"
                              style="${`transform: 
                              rotate(${((index + 1) % ((otherImages.length + 1) / 2)) * 20 * ((index + 1) % 2 ? 1 : -1)}deg);
                               z-index: -${index + 2};`}"
                          />
                      `,
                  )}
            <div
                id="upload-description"
                @paste="${(e: ClipboardEvent) => this.receivePastedImage(e)}"
                @click=${(e: Event) => this.openImageBrowser(e)}
            >
                <div id="icon-section">
                    <div id="clipboard-icon" class="icon" icon="${Icons.Clipboard}"></div>
                    <div id="drop-icon" class="icon" icon="${Icons.Drop}"></div>
                </div>
                <div id="drop-paste-order">drop/paste image</div>
                or
                <div id="brose-files-link">Browse files</div>
            </div>
            <input type="file" id="image-browser" accept="image/*" style="display:none" />
        </div>
    `;
}
