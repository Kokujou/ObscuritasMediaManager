import { html } from '../../exports.js';
import { RangeSlider } from './range-slider.js';

/**
 * @param {RangeSlider} slider
 */
export function renderRangeSlider(slider) {
    return html`
        <input
            id="slider"
            type="range"
            @input="${(e) => e.target.dispatchEvent(new Event('change'))}"
            @change="${() => slider.notifyValueChanged()}"
            .step="${slider.step}"
            .min="${slider.min}"
            .max="${slider.max}"
            .value="${slider.value}"
        />
    `;
}
