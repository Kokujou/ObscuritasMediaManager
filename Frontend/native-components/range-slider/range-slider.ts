import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderRangeSliderStyles } from './range-slider.css';
import { renderRangeSlider } from './range-slider.html';

@customElement('range-slider')
export class RangeSlider extends LitElementBase {
    static override get styles() {
        return renderRangeSliderStyles();
    }

    @property({ reflect: true }) public declare min: string;
    @property({ reflect: true }) public declare max: string;
    @property({ reflect: true }) public declare value: string;
    @property({ reflect: true }) public declare step: string;

    constructor() {
        super();
        this.min = '0';
        this.max = '100';
        this.value = '10';
        this.step = '1';
    }

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
