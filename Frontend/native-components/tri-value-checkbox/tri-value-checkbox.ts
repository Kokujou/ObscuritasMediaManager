import { customElement, property } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { LitElementBase } from '../../data/lit-element-base';
import { Enum } from '../../services/extensions/enum.extensions';
import { renderTriValueCheckbox } from './tri-value-checkbox.css';
import { renderTriValueCheckboxStyles } from './tri-value-checkbox.html';

@customElement('tri-value-checkbox')
export class TriValueCheckbox extends LitElementBase {
    static override get styles() {
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

    @property() value = CheckboxState.Ignore;
    @property() allowThreeValues = false;
    @property() disabled = false;
    @property() ignoredState = CheckboxState.Ignore;

    override render() {
        return renderTriValueCheckboxStyles.call(this);
    }

    firstUpdated(_changedProperties: Map<any, any>) {
        super.firstUpdated(_changedProperties);
        if (!this.allowThreeValues && this.value == this.ignoredState) this.value = CheckboxState.Require;
    }

    nextState() {
        this.value = Enum.nextValue(CheckboxState, this.value);
        if (this.value == this.ignoredState && !this.allowThreeValues) this.value = Enum.nextValue(CheckboxState, this.value);

        this.dispatchEvent(new CustomEvent('valueChanged', { detail: { value: this.value } }));
    }
}
