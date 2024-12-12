import { html } from 'lit-element';
import { RangeSlider } from './range-slider';

/**
 * @param {RangeSlider} slider
 */
export function renderRangeSlider(slider: RangeSlider) {
    return html`
        <input
            id="slider"
            type="range"
            @input="${(e: Event) => (e.target as HTMLInputElement).dispatchEvent(new Event('change'))}"
            @change="${() => slider.notifyValueChanged()}"
            .step="${slider.step}"
            .min="${slider.min}"
            .max="${slider.max}"
            .value="${slider.value}"
        />
    `;
}
