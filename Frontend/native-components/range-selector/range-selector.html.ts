import { html } from 'lit';
import { RangeSelector } from './range-selector';

export function renderRangeSelector(this: RangeSelector) {
    return html`
        <div id="container">
            <div id="range-graph">
                <div id="range-hover" style="left: ${this.leftPercent}%; right: ${100 - this.rightPercent}%">
                    <div id="range-tooltip">${this.left} - ${this.right}</div>
                </div>
                <div
                    id="left-slider"
                    class="slider"
                    style="left: ${this.leftPercent}%"
                    @pointerdown="${() => (this.draggingLeft = true)}"
                ></div>
                <div
                    id="right-slider"
                    class="slider"
                    style="left: ${this.rightPercent}%"
                    @pointerdown="${() => (this.draggingRight = true)}"
                ></div>
            </div>
        </div>
    `;
}
