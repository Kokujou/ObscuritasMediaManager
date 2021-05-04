import { html } from '../../exports.js';
import { UploadArea } from './upload-area.js';

/**
 * @param {UploadArea} uploadArea
 */
export function renderUploadArea(uploadArea) {
    return html`
        <div
            id="image-container"
            tabindex="0"
            @drop="${(e) => uploadArea.receiveDroppedImage(e)}"
            @dragover="${(e) => uploadArea.dragOver(e)}"
            @dragleave="${(e) => uploadArea.dragLeave(e)}"
            @click=${(e) => uploadArea.setFocusToContainer(e)}
        >
            <div id="add-icon" class="icon"></div>
            <div
                id="upload-description"
                contenteditable="true"
                @paste="${(e) => uploadArea.receivePastedImage(e)} "
                @click=${(e) => uploadArea.openImageBrowser(e)}
            >
                <div id="icon-section">
                    <div id="clipboard-icon" class="icon"></div>
                    <div id="drop-icon" class="icon"></div>
                </div>
                <div id="drop-paste-order">drop/paste image</div>
                or
                <div id="brose-files-link">Browse files</div>
            </div>
            <input type="file" id="image-browser" accept="image/*" style="display:none" />
        </div>
    `;
}
