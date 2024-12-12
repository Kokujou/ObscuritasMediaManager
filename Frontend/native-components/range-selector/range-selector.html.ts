import { html } from 'lit-element';
import { RangeSelector } from './range-selector';

/**
 * @param { RangeSelector } selector
 */
export function renderRangeSelector(selector: RangeSelector) {
    return html`
        <div id="container">
            <div id="range-graph">
                <div id="range-hover" style="left: ${selector.leftPercent}%; right: ${100 - selector.rightPercent}%">
                    <div id="range-tooltip">${selector.left} - ${selector.right}</div>
                </div>
                <div
                    id="left-slider"
                    class="slider"
                    style="left: ${selector.leftPercent}%"
                    @pointerdown="${() => (selector.draggingLeft = true)}"
                ></div>
                <div
                    id="right-slider"
                    class="slider"
                    style="left: ${selector.rightPercent}%"
                    @pointerdown="${() => (selector.draggingRight = true)}"
                ></div>
            </div>
        </div>
    `;
}
