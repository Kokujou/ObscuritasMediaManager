import { html } from 'lit-element';
import { SideScroller } from './side-scroller';

export function renderSideScroller(this: SideScroller) {
    return html`
        <div id="scroll-container">
            <a class="arrow-link ${this.canScrollLeft ? '' : 'disabled'}" id="left-arrow" @click="${() => this.scrollToLeft()}">
                ◀
            </a>
            <div id="content-container" @mousedown="${(e: Event) => e.preventDefault()}">
                <div id="item-container">
                    <div class="inner-space" id="left-space"></div>
                    <slot @slotchange="${() => this.requestFullUpdate()}"></slot>
                    <div class="inner-space" id="right-space"></div>
                </div>
            </div>
            <a
                class="arrow-link ${this.canScrollRight ? '' : 'disabled'}"
                id="right-arrow"
                @click="${() => this.scrollToRight()}"
            >
                ▶
            </a>
        </div>
    `;
}
