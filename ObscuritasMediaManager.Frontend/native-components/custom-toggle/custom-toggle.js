import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { renderCustomToggleStyles } from './custom-toggle.css.js';
import { renderCustomToggle } from './custom-toggle.html.js';

/**
 * @cssvar untoggled-color - background when not toggled
 * @cssvar toggled-color - background when toggled
 * @cssvar slider-color - slider color
 */
export class CustomToggle extends LitElementBase {
    static get styles() {
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

    connectedCallback() {
        super.connectedCallback();

        this.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.threeValues) {
                this.toggleState();
            } else this.state = this.state == CheckboxState.Ignore ? CheckboxState.Forbid : CheckboxState.Ignore;
            this.dispatchEvent(new CustomEvent('toggle', { detail: this.state }));
        };
    }

    render() {
        return renderCustomToggle(this);
    }

    toggleState() {
        var prevState = this.state;
        if (this.toggleForward) this.state = Enum.nextValue(CheckboxState, this.state, false);
        else this.state = Enum.previousValue(CheckboxState, this.state, false);
        if (this.state != prevState) return;
        this.toggleForward = !this.toggleForward;
        return this.toggleState();
    }
}
