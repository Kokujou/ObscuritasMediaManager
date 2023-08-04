import { LitElementBase } from '../../data/lit-element-base.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { renderInputDialogStyles } from './input-dialog.css.js';
import { renderInputDialog } from './input-dialog.html.js';

export class InputDialog extends LitElementBase {
    static get styles() {
        return renderInputDialogStyles();
    }

    static get properties() {
        return {};
    }

    /**
     * @param {string} message
     * @returns {Promise<string>}
     */
    static show(message) {
        return new Promise((resolve) => {
            var dialog = new InputDialog();
            dialog.resolve = resolve;
            dialog.message = message;
            PageRouting.container.append(dialog);
            dialog.requestUpdate(undefined);
            return dialog;
        });
    }

    constructor() {
        super();

        /** @type {(string)=>void} */ this.resolve;
        /** @type {string} */ this.message;
    }

    render() {
        return renderInputDialog(this);
    }

    async notifyAccepted() {
        /** @type {HTMLInputElement} */ var input = this.shadowRoot.querySelector('#base-path-input');
        this.resolve(input.value);
        this.remove();
    }

    notifyDeclined() {
        this.resolve(null);
        this.remove();
    }
}
