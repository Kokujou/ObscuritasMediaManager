import { LitElement } from '../../exports.js';
import { renderCustomToggleStyles } from './custom-toggle.css.js';
import { renderCustomToggle } from './custom-toggle.html.js';

export class CustomToggle extends LitElement {
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

        this.onclick = () => {
            this.checked = !this.checked;
            this.dispatchEvent(new CustomEvent('toggle'));
        };
    }

    render() {
        return renderCustomToggle(this);
    }
}