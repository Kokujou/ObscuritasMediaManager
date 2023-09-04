import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { renderTriValueCheckbox } from './tri-value-checkbox.css.js';
import { renderTriValueCheckboxStyles } from './tri-value-checkbox.html.js';

export class TriValueCheckbox extends LitElementBase {
    static get styles() {
        return renderTriValueCheckbox();
    }

    static get properties() {
        return {
            value: { type: String, reflect: true },
            allowThreeValues: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
            ignoredState: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {CheckboxState} */ this.value = CheckboxState.Ignore;
        /** @type {boolean} */ this.allowThreeValues = false;
        /** @type {boolean} */ this.disabled = false;
        /** @type {CheckboxState} */ this.ignoredState = CheckboxState.Ignore;
    }

    render() {
        return renderTriValueCheckboxStyles(this);
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (!this.allowThreeValues && this.value == this.ignoredState) this.value = CheckboxState.Require;
    }

    nextState() {
        this.value = Enum.nextValue(CheckboxState, this.value, true);
        if (this.value == this.ignoredState && !this.allowThreeValues)
            this.value = Enum.nextValue(CheckboxState, this.value, true);

        this.dispatchEvent(new CustomEvent('valueChanged', { detail: { value: this.value } }));
    }
}
