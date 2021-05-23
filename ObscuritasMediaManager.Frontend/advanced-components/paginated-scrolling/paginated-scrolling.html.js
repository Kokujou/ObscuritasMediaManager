import { html } from '../../exports.js';
import { PaginatedScrolling } from './paginated-scrolling.js';

/**
 * @param {PaginatedScrolling} scrolling
 */
export function renderPaginatedScrolling(scrolling) {
    return html`
        <div class="scroll-container" @scroll="${() => scrolling.onScroll()}">
            <slot @slotchange="${() => scrolling.requestUpdate(undefined)}"></slot>
        </div>
    `;
}
