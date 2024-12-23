import { customElement, property } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { LitElementBase } from '../../data/lit-element-base';
import { Enum } from '../../services/extensions/enum.extensions';
import { renderTriValueCheckboxStyles } from './tri-value-checkbox.css';
import { renderTriValueCheckbox } from './tri-value-checkbox.html';

@customElement('tri-value-checkbox')
export class TriValueCheckbox extends LitElementBase {
    static override get styles() {
        return renderTriValueCheckboxStyles();
    }

    @property({ reflect: true }) public declare value: CheckboxState;
    @property({ type: Boolean, reflect: true }) public declare allowThreeValues: boolean;
    @property({ type: Boolean, reflect: true }) public declare disabled: boolean;
    @property() public declare ignoredState: CheckboxState;

    constructor() {
        super();
        this.ignoredState = CheckboxState.Ignore;
        this.value = CheckboxState.Ignore;
    }

    override render() {
        return renderTriValueCheckbox.call(this);
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
