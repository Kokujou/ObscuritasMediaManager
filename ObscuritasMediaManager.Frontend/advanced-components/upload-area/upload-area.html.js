import { html } from '../../exports.js';
import { UploadArea } from './upload-area.js';

/**
 * @param {UploadArea} uploadArea
 */
export function renderUploadArea(uploadArea) {
    return html`
        <div
            class="image-container"
            tabindex="0"
            @drop="${(e) => uploadArea.receiveDroppedImage(e)}"
            @dragover="${(e) => uploadArea.dragOver(e)}"
            @dragleave="${(e) => uploadArea.dragLeave(e)}"
            @click=${(e) => uploadArea.setFocusToContainer(e)}
        >
            <div class="add-icon icon"></div>
            <div
                class="upload-description"
                contenteditable="true"
                @paste="${(e) => uploadArea.receivePastedImage(e)} "
                @click=${(e) => uploadArea.openImageBrowser(e)}
            >
                <div class="icon-section">
                    <div class="clipboard-icon icon"></div>
                    <div class="drop-icon icon"></div>
                </div>
                <div class="drop-paste-order">drop/paste image</div>
                or
                <div class="brose-files-link">Browse files</div>
            </div>
            <input type="file" id="image-browser" accept="image/*" style="display:none" />
        </div>
    `;
}
