import { html } from 'lit-element';
import { PaginatedScrolling } from './paginated-scrolling';

export function renderPaginatedScrolling(this: PaginatedScrolling) {
    return html`
        <div class="scroll-container" @scroll="${() => this.onScroll()}">
            <slot @slotchange="${() => this.requestFullUpdate()}"></slot>
        </div>
    `;
}
