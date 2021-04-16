import { LitElement } from '../../exports.js';
import { renderTriValueCheckbox } from './tri-value-checkbox.css.js';
import { renderTriValueCheckboxStyles } from './tri-value-checkbox.html.js';

export class TriValueCheckbox extends LitElement {
    static get styles() {
        return renderTriValueCheckbox();
    }

    static get properties() {
        return {
            value: { type: Number, reflect: true },
        };
    }

    get valueClass() {
        switch (this.value) {
            case -1:
                return 'forbid';
            case 0:
                return 'ignore';
            case 1:
                return 'allow';
            default:
                throw new Error('invalid value for the tri value checkbox');
        }
    }

    constructor() {
        super();
        /** @type {number} */ this.value = 0;
    }

    render() {
        return renderTriValueCheckboxStyles(this);
    }

    nextState() {
        this.value++;
        if (this.value > 1) this.value = -1;

        var valuechangedEvent = new CustomEvent('valueChanged', { detail: { value: this.value } });
        this.dispatchEvent(valuechangedEvent);
    }
}
