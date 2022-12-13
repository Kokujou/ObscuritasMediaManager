import { LitElementBase } from '../../data/lit-element-base.js';
import { renderSelectOptionsDialogStyles } from './select-options-dialog.css.js';
import { renderSelectOptionsDialog } from './select-options-dialog.html.js';

export class SelectOptionsDialog extends LitElementBase {
    static get styles() {
        return renderSelectOptionsDialogStyles();
    }

    static get properties() {
        return {
            options: { type: Object, reflect: true },
            multiselect: { type: Boolean, reflect: true },
        };
    }

    /**
     * @param {Object.<string,string>} options
     */
    static show(options, multiselect = true) {
        var dialog = new SelectOptionsDialog();
        dialog.options = options;
        dialog.multiselect = multiselect;

        document.body.append(dialog);

        return dialog;
    }

    constructor() {
        super();

        /** @type {Object.<string,string>} */ this.options = {};
        /** @type {boolean} */ this.multiselect = true;
    }

    render() {
        return renderSelectOptionsDialog(this);
    }

    accept(e) {
        /** @type {NodeListOf<HTMLInputElement>} */ var checkedInputs = this.shadowRoot.querySelectorAll('input:checked');
        var selectedIds = [];
        for (var input of checkedInputs) selectedIds.push(input.value);
        this.dispatchCustomEvent('accept', { selected: selectedIds });
    }
}
