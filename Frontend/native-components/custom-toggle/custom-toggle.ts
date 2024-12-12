import { customElement } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { LitElementBase } from '../../data/lit-element-base';
import { Enum } from '../../services/extensions/enum.extensions';
import { renderCustomToggleStyles } from './custom-toggle.css';
import { renderCustomToggle } from './custom-toggle.html';

/**
 * @cssvar untoggled-color - background when not toggled
 * @cssvar toggled-color - background when toggled
 * @cssvar slider-color - slider color
 */
@customElement('custom-toggle')
export class CustomToggle extends LitElementBase {
    static override get styles() {
        return renderCustomToggleStyles();
    }

    static get properties() {
        return {
            toggled: { type: Boolean, reflect: true },
            state: { type: String, reflect: true },
            threeValues: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {boolean} */ this.toggled = false;
        /** @type {CheckboxState} */ this.state = CheckboxState.Forbid;
        /** @type {boolean} */ this.threeValues = false;
        this.toggleForward = true;
    }

    override connectedCallback() {
        super.connectedCallback();

        this.onclick = (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.threeValues) {
                this.toggleState();
            } else this.state = this.state == CheckboxState.Ignore ? CheckboxState.Forbid : CheckboxState.Ignore;
            this.dispatchEvent(new CustomEvent('toggle', { detail: this.state, bubbles: true }));
        };
    }

    override render() {
        return renderCustomToggle(this);
    }

    toggleState() {
        var prevState = this.state;
        this.state = Enum.nextValue(CheckboxState, this.state);
        if (this.state != prevState) return;
        this.toggleForward = !this.toggleForward;
        return this.toggleState();
    }
}
