import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { TimeSpan } from '../../data/timespan';
import { renderDurationInputStyles } from './duration-input.css';
import { renderDurationInput } from './duration-input.html';

@customElement('duration-input')
export class DurationInput extends LitElementBase {
    static override get styles() {
        return renderDurationInputStyles();
    }

    @property({ type: Object }) declare public timespan: TimeSpan;
    @property({ type: Boolean }) declare public compact: boolean;

    constructor() {
        super();
        this.timespan = new TimeSpan();
    }

    handleValueChange(property: keyof TimeSpan, element: HTMLInputElement, max: number) {
        if (Number.parseInt(element.value) > max) element.value = max.toString().padStart(2, '0');
        element.value = Number.parseInt(element.value).toString().padStart(2, '0');

        if (property == 'toString') return;
        if (typeof this.timespan[property] != 'number') return;
        this.timespan[property] = Number.parseInt(element.value) as any;
        this.dispatchEvent(new CustomEvent('duration-changed', { detail: this.timespan.toString() }));
    }

    override render() {
        return renderDurationInput.call(this);
    }
}
