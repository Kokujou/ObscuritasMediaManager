import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { renderCustomToggleStyles } from './custom-toggle.css.js';
import { renderCustomToggle } from './custom-toggle.html.js';

export class CustomToggle extends LitElementBase {
    static get styles() {
        return renderCustomToggleStyles();
    }

    static get properties() {
        return {
            state: { type: String, reflect: true },
            threeValues: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {CheckboxState} */ this.state = CheckboxState.Forbid;
        /** @type {boolean} */ this.threeValues = false;
    }

    connectedCallback() {
        super.connectedCallback();

        this.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (this.threeValues) this.state = Enum.nextValue(CheckboxState, this.state, false);
            else this.state = this.state == CheckboxState.Ignore ? CheckboxState.Forbid : CheckboxState.Ignore;
            this.dispatchEvent(new CustomEvent('toggle', { detail: this.state }));
        };
    }

    render() {
        return renderCustomToggle(this);
    }
}
