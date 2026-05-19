import { customElement, property, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { waitForProperty } from '../../extensions/animation.extension';
import { SideScroller } from '../../native-components/side-scroller/side-scroller';
import { renderImageSlideshowStyles } from './image-slideshow.css';
import { renderImageSlideshow } from './image-slideshow.html';
import { SlideshowImage } from './slideshow-image';

@customElement('image-slideshow')
export class ImageSlideshow extends LitElementBase {
    static override get styles() {
        return renderImageSlideshowStyles();
    }

    @property({ type: Array }) declare public images: SlideshowImage[];

    @query('side-scroller') declare public sideScroller?: SideScroller;
    @query('#current-image') declare protected currentImageElement?: HTMLImageElement;

    @state() declare protected loading: boolean;
    @state() declare protected currentImage?: SlideshowImage;

    get currentAspectRatio() {
        if (!this.currentImageElement) return 1;
        return this.currentImageElement.naturalWidth / this.currentImageElement.naturalHeight;
    }

    @property({ type: Number })
    get currentIndex() {
        return this.sideScroller?.currentItemIndex ?? 0;
    }

    set currentIndex(value: number) {
        waitForProperty(this, 'sideScroller').then(() => {
            this.sideScroller!.setIndex(value);
            this.requestFullUpdate();
        });
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.tabIndex = 0;
        this.focus();

        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    updated(_changedProperties: Map<any, any>) {
        super.updated(_changedProperties);

        this.changeCurrentImage();
    }

    override render() {
        return renderImageSlideshow.call(this);
    }

    async changeCurrentImage(ignoreFrom = false) {
        const newImage = this.images[this.currentIndex];
        if (!newImage || newImage.id == this.currentImage?.id) return;

        if (!ignoreFrom)
            this.dispatchEvent(
                new CustomEvent('image-changing', { detail: this.currentImage?.id, bubbles: true, composed: true }),
            );
        if (this.currentIndex >= this.images.length - 5) this.notifyScrollToEnd();
        this.currentImage = newImage;

        this.dispatchEvent(new CustomEvent('image-changed', { detail: this.currentImage.id, bubbles: true, composed: true }));
        this.requestFullUpdate();
    }

    async handleKeyUp(event: KeyboardEvent) {
        if (event.key == 'Delete') {
            var confirmed = await DialogBase.show('Bist du sicher?', {
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
                content: `Das Bild wird aus dem Cache gelöscht und kann nicht wiederhergestellt werden.
    Es bleibt jedoch auf deinem Computer erhalten.
    Bit du sicher dass du es löschen möchtest?`,
            });
            if (!confirmed) return;
            this.notifyImageRemoved(this.currentImage!.id);
        }
        if (event.key == 'ArrowLeft') this.sideScroller!.setIndex(this.currentIndex - 1);
        if (event.key == 'ArrowRight') this.sideScroller!.setIndex(this.currentIndex + 1);
    }

    notifyScrollToEnd() {
        this.dispatchEvent(new CustomEvent('scroll-to-end', { bubbles: true, composed: true }));
    }

    notifyImageRemoved(imageId: string) {
        this.dispatchEvent(new CustomEvent('image-removed', { detail: imageId, bubbles: true, composed: true }));
    }

    notifyImageError(imageId: string) {
        this.dispatchEvent(new CustomEvent('image-error', { detail: imageId, bubbles: true, composed: true }));
    }

    notifyThumbError(imageId: string) {
        this.dispatchEvent(new CustomEvent('thumb-error', { detail: imageId, bubbles: true, composed: true }));
    }
}
