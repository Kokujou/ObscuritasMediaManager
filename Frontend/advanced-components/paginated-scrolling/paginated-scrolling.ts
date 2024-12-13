import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderPaginatedScrollingStyles } from './paginated-scrolling.css';
import { renderPaginatedScrolling } from './paginated-scrolling.html';

@customElement('paginated-scrolling')
export class PaginatedScrolling extends LitElementBase {
    static override get styles() {
        return renderPaginatedScrollingStyles();
    }

    static get properties() {
        return {
            scrollTopThreshold: { type: Number, reflect: true },
        };
    }

    @property({ type: Number }) scrollTopThreshold = 0;

    override render() {
        return renderPaginatedScrolling.call(this);
    }

    scrollToTop() {
        this.shadowRoot!.querySelector('.scroll-container')!.scrollTo({ top: 0, behavior: 'smooth' });
    }

    onScroll() {
        var scrollContainer = this.shadowRoot!.querySelector<HTMLElement>('.scroll-container')!;
        var scrollMax = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
        if (scrollContainer.scrollTop >= scrollMax - this.scrollTopThreshold) this.requestAdditionalContent();
    }

    scrollToChild(child: HTMLElement) {
        var scrollContainer = this.shadowRoot!.querySelector<HTMLElement>('.scroll-container')!;
        scrollContainer.scrollTo({
            top: child.offsetTop + child.offsetHeight - scrollContainer.offsetHeight,
        });
    }

    childVisible(child: HTMLElement) {
        var scrollContainer = this.shadowRoot!.querySelector<HTMLElement>('.scroll-container')!;
        if (
            child.offsetTop - child.offsetHeight / 2 > scrollContainer.scrollTop &&
            child.offsetTop + child.offsetHeight * 1.5 < scrollContainer.scrollTop + scrollContainer.offsetHeight
        )
            return true;
        return false;
    }

    requestAdditionalContent() {
        this.dispatchEvent(new CustomEvent('scrollBottom'));
    }
}
