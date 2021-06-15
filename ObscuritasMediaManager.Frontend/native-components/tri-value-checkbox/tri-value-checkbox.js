import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElement } from '../../exports.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { renderTriValueCheckbox } from './tri-value-checkbox.css.js';
import { renderTriValueCheckboxStyles } from './tri-value-checkbox.html.js';

export class TriValueCheckbox extends LitElement {
    static get styles() {
        return renderTriValueCheckbox();
    }

    static get properties() {
        return {
            value: { type: String, reflect: true },
            allowThreeValues: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {CheckboxState} */ this.value = CheckboxState.Ignore;
        /** @type {boolean} */ this.allowThreeValues = false;
        /** @type {boolean} */ this.disabled = false;
    }

    render() {
        return renderTriValueCheckboxStyles(this);
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (!this.allowThreeValues && this.value == CheckboxState.Ignore) this.value = CheckboxState.Allow;
    }

    nextState() {
        this.value = Enum.nextValue(CheckboxState, this.value, false);
        if (this.value == CheckboxState.Ignore && !this.allowThreeValues) this.value = Enum.nextValue(CheckboxState, this.value, false);

        var valuechangedEvent = new CustomEvent('valueChanged', { detail: { value: this.value } });
        this.dispatchEvent(valuechangedEvent);
    }
}
