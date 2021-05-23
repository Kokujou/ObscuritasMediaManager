import { LitElement } from '../../exports.js';
import { renderPaginatedScrollingStyles } from './paginated-scrolling.css.js';
import { renderPaginatedScrolling } from './paginated-scrolling.html.js';

export class PaginatedScrolling extends LitElement {
    static get styles() {
        return renderPaginatedScrollingStyles();
    }

    static get properties() {
        return {
            scrollTopThreshold: { type: Number, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {number} */ this.scrollTopThreshold = 0;
    }

    render() {
        return renderPaginatedScrolling(this);
    }

    scrollToTop() {
        this.shadowRoot.querySelector('.scroll-container').scrollTo({ top: 0, behavior: 'smooth' });
    }

    onScroll() {
        /** @type {HTMLElement} */ var scrollContainer = this.shadowRoot.querySelector('.scroll-container');
        var scrollMax = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
        if (scrollContainer.scrollTop >= scrollMax - this.scrollTopThreshold) this.requestAdditionalContent();
    }

    requestAdditionalContent() {
        var scrollBottomEvent = new CustomEvent('scrollBottom');
        this.dispatchEvent(scrollBottomEvent);
        this.requestUpdate(undefined);
    }
}
