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

    @property({ type: Object }) public declare timespan: TimeSpan;
    @property({ type: Boolean }) public declare compact: boolean;

    constructor() {
        super();
        this.timespan = new TimeSpan();
    }

    handleKeyDown(event: KeyboardEvent) {
        var keyNumber = Number.parseInt(event.key);
        var target = event.target as HTMLInputElement;

        if (keyNumber >= 0) {
            target.value = (Number.parseInt(target.value) + keyNumber).toString().padStart(2, '0');
            return;
        }

        if (event.key.length == 1 && !keyNumber && keyNumber != 0) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
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
