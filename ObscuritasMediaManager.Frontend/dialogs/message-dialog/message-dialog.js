import { LitElement } from '../../exports.js';
import { renderMessageDialogStyles } from './message-dialog.css.js';
import { renderMessageDialog } from './message-dialog.html.js';

export class MessageDialog extends LitElement {
    static get styles() {
        return renderMessageDialogStyles();
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
            message: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.caption;
        /** @type {string} */ this.message;
    }

    static show(title, message) {
        // @ts-ignore
        /** @type {MessageDialog }*/ var dialog = document.createElement('message-dialog');

        dialog.caption = title;
        dialog.message = message;
        document.body.append(dialog);

        return dialog;
    }

    render() {
        return renderMessageDialog(this);
    }
}
