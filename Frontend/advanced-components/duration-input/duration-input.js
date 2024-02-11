import { LitElementBase } from '../../data/lit-element-base.js';
import { TimeSpan } from '../../data/timespan.js';
import { renderDurationInputStyles } from './duration-input.css.js';
import { renderDurationInput } from './duration-input.html.js';

export class DurationInput extends LitElementBase {
    static get styles() {
        return renderDurationInputStyles();
    }

    static get properties() {
        return {
            timespan: { type: Object, reflect: true },
        };
    }

    constructor() {
        super();

        this.timespan = new TimeSpan();
    }

    /**
     *
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        if (event.key.length == 1 && !Number.parseInt(event.key)) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        var target = /** @type {HTMLInputElement} */ (event.target);
        if (target.value[0] == '0') target.value = Number.parseInt(target.value).toString();
    }

    /**
     *
     * @param {keyof TimeSpan} property
     * @param {HTMLInputElement} element
     */
    handleValueChange(property, element) {
        if (property == 'toString') return;
        this.timespan[property] = Number.parseInt(element.value);
        this.dispatchEvent(new CustomEvent('duration-changed', { detail: this.timespan.toString() }));
    }

    render() {
        return renderDurationInput(this);
    }
}
