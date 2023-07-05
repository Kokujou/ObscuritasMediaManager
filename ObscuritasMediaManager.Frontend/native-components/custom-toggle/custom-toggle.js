import { LitElementBase } from '../../data/lit-element-base.js';
import { renderCustomToggleStyles } from './custom-toggle.css.js';
import { renderCustomToggle } from './custom-toggle.html.js';

export class CustomToggle extends LitElementBase {
    static get styles() {
        return renderCustomToggleStyles();
    }

    static get properties() {
        return {
            checked: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {boolean} */ this.checked = false;
    }

    connectedCallback() {
        super.connectedCallback();

        this.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.checked = !this.checked;
            this.dispatchCustomEvent('toggle');
        };
    }

    render() {
        return renderCustomToggle(this);
    }
}
