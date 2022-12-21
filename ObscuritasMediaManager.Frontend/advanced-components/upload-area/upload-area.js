import { LitElementBase } from '../../data/lit-element-base.js';
import { fileToDataUrl } from '../../services/extensions/file.extension.js';
import { renderUploadAreaStyles } from './upload-area.css.js';
import { renderUploadArea } from './upload-area.html.js';

export class UploadArea extends LitElementBase {
    static get styles() {
        return renderUploadAreaStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.someProperty;
    }

    render() {
        return renderUploadArea(this);
    }

    setFocusToContainer(event) {
        event.stopPropagation();
        var el = this.shadowRoot.querySelector('#upload-description');
        var range = document.createRange();
        var sel = window.getSelection();

        range.setStart(el.childNodes[2], 5);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }

    openImageBrowser(event) {
        event.stopPropagation();
        /** @type {HTMLInputElement} */ var imageBrowser = this.shadowRoot.querySelector('#image-browser');
        imageBrowser.click();
        imageBrowser.addEventListener('change', async () => {
            try {
                var selectedImageData = await fileToDataUrl(imageBrowser.files[0]);
                this.notifyImageAdded(selectedImageData);
            } catch (err) {
                console.error(err);
            }
        });
    }

    /**
     * @param {Event} event
     */
    async receivePastedImage(event) {
        event.preventDefault();
        // @ts-ignore
        /** @type {DataTransfer} */ var clipboardData = event.clipboardData;
        await this.processImageDataTransfer(clipboardData);
    }

    /**
     * @param {Event} event
     */
    dragOver(event) {
        event.preventDefault();
        var targetElementClasses = this.shadowRoot.querySelector('#image-container').classList;
        if (!targetElementClasses.contains('focus')) targetElementClasses.add('focus');
    }

    /**
     * @param {Event} event
     */
    dragLeave(event) {
        event.preventDefault();
        var targetElementClasses = this.shadowRoot.querySelector('#image-container').classList;
        if (targetElementClasses.contains('focus')) targetElementClasses.remove('focus');
    }

    /**
     * @param {Event} event
     */
    async receiveDroppedImage(event) {
        event.preventDefault();
        // @ts-ignore
        /** @type {DataTransfer} */ var dataTransfer = event.dataTransfer;
        await this.processImageDataTransfer(dataTransfer);
        this.dragLeave(event);
    }

    /**
     * @param {DataTransfer} dataTransfer
     */
    async processImageDataTransfer(dataTransfer) {
        try {
            if (dataTransfer.files[0])
                var selectedImageData = await fileToDataUrl(dataTransfer.files[0] ?? dataTransfer.items[0]?.getAsFile());
            else selectedImageData = dataTransfer.getData('text');
            this.notifyImageAdded(selectedImageData);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @param {string} selectedImageData
     */
    notifyImageAdded(selectedImageData) {
        this.dispatchCustomEvent('imageReceived', { imageData: selectedImageData });
    }
}
