import { LitElement } from '../../exports.js';
import { renderPathInputDialogStyles } from './path-input-dialog.css.js';
import { renderPathInputDialog } from './path-input-dialog.html.js';

export class PathInputDialog extends LitElement {
    static get styles() {
        return renderPathInputDialogStyles();
    }

    static get properties() {
        return {};
    }

    static show() {
        var dialog = new PathInputDialog();
        document.body.append(dialog);
        return dialog;
    }

    constructor() {
        super();
    }

    render() {
        return renderPathInputDialog(this);
    }

    async notifyAccepted() {
        /** @type {HTMLInputElement} */ var input = this.shadowRoot.querySelector('#base-path-input');

        var acceptEvent = new CustomEvent('accept', { detail: { path: input.value } });
        this.dispatchEvent(acceptEvent);
    }

    notifyDeclined() {
        this.dispatchEvent(new CustomEvent('decline'));
    }
}
