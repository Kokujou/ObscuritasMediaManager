import { LitElementBase } from '../../data/lit-element-base.js';
import { renderPathInputDialogStyles } from './path-input-dialog.css.js';
import { renderPathInputDialog } from './path-input-dialog.html.js';

export class PathInputDialog extends LitElementBase {
    static get styles() {
        return renderPathInputDialogStyles();
    }

    static get properties() {
        return {};
    }

    /**
     *
     * @returns {Promise<string>}
     */
    static show() {
        return new Promise((resolve) => {
            var dialog = new PathInputDialog();
            dialog.resolve = resolve;
            document.body.append(dialog);
            return dialog;
        });
    }

    constructor() {
        super();

        /** @type {(string)=>void} */ this.resolve;
    }

    render() {
        return renderPathInputDialog(this);
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
