import { html } from '../../exports.js';
import { ScrollSelect } from './scroll-select.js';

/**
 * @param {ScrollSelect} scrollSelect
 */
export function renderScrollSelect(scrollSelect) {
    return html`
        <div id="scroll-container" @pointerdown="${() => scrollSelect.startDragScrolling()}">
            <div id="scroll-items">
                <div id="item-container">
                    <div class="inner-space">x</div>
                    ${scrollSelect.options.map(
                        (x) =>
                            html`<div
                                class="scroll-item ${scrollSelect.options[scrollSelect.currentItemIndex] == x ? 'active' : ''}"
                                @click="${() => scrollSelect.scrollToItem(x)}"
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
