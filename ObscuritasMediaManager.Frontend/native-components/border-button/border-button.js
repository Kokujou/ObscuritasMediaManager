import { LitElement } from '../../exports.js';
import { renderBorderButtonStyles } from './border-button.css.js';
import { renderBorderButton } from './border-button.html.js';

export class BorderButton extends LitElement {
    static get styles() {
        return renderBorderButtonStyles();
    }

    static get properties() {
        return {
            text: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.text;
    }

    render() {
        return renderBorderButton(this);
    }
}
