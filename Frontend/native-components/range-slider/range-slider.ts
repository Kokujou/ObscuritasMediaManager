import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderRangeSliderStyles } from './range-slider.css';
import { renderRangeSlider } from './range-slider.html';

@customElement('range-slider')
export class RangeSlider extends LitElementBase {
    static override get styles() {
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

    @property() min = '0';
    @property() max = '100';
    @property() value = '10';
    @property() step = '1';

    override render() {
        return renderRangeSlider.call(this);
    }

    notifyValueChanged() {
        var sliderElement = this.shadowRoot!.querySelector('#slider') as HTMLInputElement;
        this.value = sliderElement.value;
        var eventData = { value: this.value };
        this.dispatchEvent(new CustomEvent('valueChanged', { detail: eventData }));
    }
}
