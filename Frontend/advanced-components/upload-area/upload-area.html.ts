import { html } from 'lit';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { UploadArea } from './upload-area';

export function renderUploadArea(this: UploadArea) {
    return html`
        <div
            id="image-container"
            tabindex="0"
            @drop="${(e: DragEvent) => this.receiveDroppedImage(e)}"
            @dragover="${(e: DragEvent) => this.dragOver(e)}"
            @dragleave="${(e: DragEvent) => this.dragLeave(e)}"
            @click=${(e: Event) => this.setFocusToContainer(e)}
        >
            <div id="add-icon" class="icon" icon="${Icons.Plus}"></div>
            <div
                id="upload-description"
                contenteditable="true"
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
