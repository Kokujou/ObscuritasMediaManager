import { LitElement } from '../../exports.js';
import { renderDialogBaseStyles } from './dialog-base.css.js';
import { renderDialogBase } from './dialog-base.html.js';

export class DialogBase extends LitElement {
    static get styles() {
        return renderDialogBaseStyles();
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.caption;
    }

    render() {
        return renderDialogBase(this);
    }

    accept() {
        var event = new CustomEvent('accept');
        this.dispatchEvent(event);
    }

    decline() {
        var event = new CustomEvent('decline');
        this.dispatchEvent(event);
    }
}
