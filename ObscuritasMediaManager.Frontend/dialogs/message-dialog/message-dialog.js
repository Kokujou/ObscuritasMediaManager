import { LitElementBase } from '../../data/lit-element-base.js';
import { renderMessageDialogStyles } from './message-dialog.css.js';
import { renderMessageDialog } from './message-dialog.html.js';

export class MessageDialog extends LitElementBase {
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
        var dialog = new MessageDialog();
        dialog.caption = title;
        dialog.message = message;
        document.body.append(dialog);

        return new Promise((resolve, reject) => {
            dialog.addEventListener('accept', () => {
                resolve();
                dialog.remove();
            });
            dialog.addEventListener('decline', () => {
                reject();
                dialog.remove();
            });
        });
    }

    render() {
        return renderMessageDialog(this);
    }
}
