import { html } from 'lit';
import { RangeSlider } from './range-slider';

export function renderRangeSlider(this: RangeSlider) {
    return html`
        <input
            id="slider"
            type="range"
            @input="${(e: Event) => (e.target as HTMLInputElement).dispatchEvent(new Event('change'))}"
            @change="${() => this.notifyValueChanged()}"
            .step="${this.step}"
            .min="${this.min}"
            .max="${this.max}"
            .value="${this.value}"
        />
    `;
}
