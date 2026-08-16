import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { fileToDataUrl } from '../../extensions/file.extension';
import { renderUploadAreaStyles } from './upload-area.css';
import { renderUploadArea } from './upload-area.html';

@customElement('upload-area')
export class UploadArea extends LitElementBase {
    static override get styles() {
        return renderUploadAreaStyles();
    }

    @property({ type: Array }) declare public images?: string[];
    @property({ type: Boolean, reflect: true }) declare public disabled: boolean;

    @state() declare protected tempImages: string[];
    @state() declare protected noImage: boolean;

    constructor() {
        super();
        this.tempImages = [];
    }

    override render() {
        return renderUploadArea.call(this);
    }

    override updated(_changedProperties: Map<any, any>): void {
        super.updated(_changedProperties);

        if (_changedProperties.has('src')) {
            this.noImage = false;
            this.tempImages = [];
        }
    }

    setFocusToContainer(event: Event) {
        event.stopPropagation();
        this.shadowRoot!.querySelector<HTMLElement>('#image-container')?.focus();
    }

    openImageBrowser(event: Event) {
        event.stopPropagation();
        var imageBrowser = this.shadowRoot!.querySelector('#image-browser') as HTMLInputElement;
        imageBrowser.click();
        imageBrowser.addEventListener('change', async () => {
            try {
                var selectedImageData = await fileToDataUrl(imageBrowser.files![0]);
                this.notifyImageAdded(selectedImageData!);
            } catch (err) {
                console.error(err);
            }
        });
    }

    async receivePastedImage(event: ClipboardEvent) {
        event.preventDefault();
        var clipboardData = event.clipboardData as DataTransfer;
        await this.processImageDataTransfer(clipboardData);
    }

    dragOver(event: Event) {
        event.preventDefault();
        var targetElementClasses = this.shadowRoot!.querySelector('#image-container')!.classList;
        if (!targetElementClasses.contains('focus')) targetElementClasses.add('focus');
    }

    dragLeave(event: Event) {
        event.preventDefault();
        var targetElementClasses = this.shadowRoot!.querySelector('#image-container')!.classList;
        if (targetElementClasses.contains('focus')) targetElementClasses.remove('focus');
    }

    async receiveDroppedImage(event: DragEvent) {
        event.preventDefault();
        var dataTransfer = event.dataTransfer as DataTransfer;
        await this.processImageDataTransfer(dataTransfer);
        this.dragLeave(event);
    }

    async processImageDataTransfer(dataTransfer: DataTransfer) {
        try {
            if (dataTransfer.files[0])
                var selectedImageData = await fileToDataUrl(dataTransfer.files[0] ?? dataTransfer.items[0]?.getAsFile());
            else selectedImageData = dataTransfer.getData('text');
            this.notifyImageAdded(selectedImageData!);
        } catch (err) {
            console.error(err);
        }
    }

    notifyImageAdded(selectedImageData: string) {
        this.tempImages = [...this.tempImages, 'data: image/png;base64,' + selectedImageData];
        this.noImage = false;
        this.dispatchEvent(
            new CustomEvent('imageReceived', { detail: { imageData: selectedImageData }, bubbles: true, composed: true }),
        );
    }

    notifyImageClicked() {
        this.dispatchEvent(new CustomEvent('image-click', { bubbles: true, composed: true }));
    }
}
