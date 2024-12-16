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

    constructor() {
        super();
        this.timespan = new TimeSpan();
    }

    handleKeyDown(event: KeyboardEvent) {
        if (event.key.length == 1 && !Number.parseInt(event.key)) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        var target = event.target as HTMLInputElement;
        if (target.value[0] == '0') target.value = Number.parseInt(target.value).toString();
    }

    handleValueChange(property: keyof TimeSpan, element: HTMLInputElement) {
        if (property == 'toString') return;
        if (typeof this.timespan[property] != 'number') return;
        this.timespan[property] = Number.parseInt(element.value) as any;
        this.dispatchEvent(new CustomEvent('duration-changed', { detail: this.timespan.toString() }));
    }

    override render() {
        return renderDurationInput.call(this);
    }
}
