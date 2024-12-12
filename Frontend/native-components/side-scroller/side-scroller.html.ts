import { html } from 'lit-element';
import { SideScroller } from './side-scroller';

/**
 * @param {SideScroller} sideScroller
 */
export function renderSideScroller(sideScroller: SideScroller) {
    return html`
        <div id="scroll-container">
            <a
                class="arrow-link ${sideScroller.canScrollLeft ? '' : 'disabled'}"
                id="left-arrow"
                @click="${() => sideScroller.scrollToLeft()}"
            >
                ◀
            </a>
            <div id="content-container" @mousedown="${(e: Event) => e.preventDefault()}">
                <div id="item-container">
                    <div class="inner-space" id="left-space"></div>
                    <slot @slotchange="${() => sideScroller.requestFullUpdate()}"></slot>
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
