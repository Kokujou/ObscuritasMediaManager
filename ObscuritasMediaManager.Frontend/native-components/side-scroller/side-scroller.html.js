import { html } from '../../exports.js';
import { SideScroller } from './side-scroller.js';

/**
 * @param {SideScroller} sideScroller
 */
export function renderSideScroller(sideScroller) {
    return html`
        <div id="scroll-container">
            <a
                class="arrow-link ${sideScroller.canScrollLeft ? '' : 'disabled'}"
                id="left-arrow"
                @click="${() => sideScroller.scrollToLeft()}"
            >
                ◀
            </a>
            <div id="content-container" @mousedown="${(e) => e.preventDefault()}">
                <div id="item-container">
                    <div class="inner-space" id="left-space"></div>
                    <slot @slotchange="${() => sideScroller.requestUpdate(undefined)}"></slot>
                    <div class="inner-space" id="right-space"></div>
                </div>
            </div>
            <a
                class="arrow-link ${sideScroller.canScrollRight ? '' : 'disabled'}"
                id="right-arrow"
                @click="${() => sideScroller.scrollToRight()}"
            >
                ▶
            </a>
        </div>
    `;
}
