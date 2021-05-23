import { LitElement } from '../../exports.js';
import { renderRangeSliderStyles } from './range-slider.css.js';
import { renderRangeSlider } from './range-slider.html.js';

export class RangeSlider extends LitElement {
    static get styles() {
        return renderRangeSliderStyles();
    }

    static get properties() {
        return {
            min: { type: String, reflect: true },
            max: { type: String, reflect: true },
            value: { type: String, reflect: true },
            step: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.min = '0';
        /** @type {string} */ this.max = '100';
        /** @type {string} */ this.value = '10';
        /** @type {string} */ this.step = '1';
    }

    render() {
        return renderRangeSlider(this);
    }

    notifyValueChanged() {
        /** @type {HTMLInputElement} */ var sliderElement = this.shadowRoot.querySelector('#slider');
        this.value = sliderElement.value;
        var eventData = { value: this.value };
        this.dispatchEvent(new CustomEvent('valueChanged', { detail: eventData }));
    }
}
