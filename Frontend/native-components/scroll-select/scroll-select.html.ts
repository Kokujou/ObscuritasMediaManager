import { html } from 'lit-element';
import { ScrollSelect } from './scroll-select';

export function renderScrollSelect(this: ScrollSelect) {
    return html`
        <div id="scroll-container" @pointerdown="${() => this.startDragScrolling()}">
            <div id="scroll-items">
                <div id="item-container">
                    <div class="inner-space">x</div>
                    ${this.options.map(
                        (x) =>
                            html`<div
                                class="scroll-item ${this.options[this.currentItemIndex] == x ? 'active' : ''}"
                                @click="${() => this.scrollToItem(x)}"
                            >
                                ${x}
                            </div>`
                    )}

                    <div class="inner-space">x</div>
                </div>
            </div>
            <div id="border-overlay"></div>
        </div>
    `;
}
