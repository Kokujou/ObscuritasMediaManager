import { LitElementBase } from '../../data/lit-element-base.js';
import { TemplateResult } from '../../exports.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
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
     * @param {Object.<string,TemplateResult | string>} options
     */
    static show(options, multiselect = true) {
        var dialog = new SelectOptionsDialog();
        dialog.options = options;
        dialog.multiselect = multiselect;
        dialog.isComplete = () => true;

        PageRouting.container.append(dialog);

        return dialog;
    }

    /**
     *
     * @param {()=>boolean} isComplete
     * @returns
     */
    static startShowing(isComplete, multiselect = true) {
        var dialog = new SelectOptionsDialog();
        dialog.options = {};
        dialog.multiselect = multiselect;
        dialog.isComplete = isComplete;

        PageRouting.container.append(dialog);

        return dialog;
    }
    /** @type {Object.<string,TemplateResult | string>} */ options = {};
    /** @type {boolean} */ multiselect = true;
    /** @type {()=>boolean} */ isComplete = () => false;

    render() {
        return renderSelectOptionsDialog(this);
    }

    /** @param {Event} e */
    accept(e) {
        e.stopPropagation();
        /** @type {NodeListOf<HTMLInputElement>} */ var checkedInputs = this.shadowRoot.querySelectorAll('input:checked');
        var selectedIds = [];
        for (var input of checkedInputs) selectedIds.push(input.value);
        this.dispatchEvent(new CustomEvent('accept', { detail: { selected: selectedIds } }));
    }

    /**
     *
     * @param {string} key
     * @param {TemplateResult | string} value
     */
    addEntry(key, value) {
        this.options[key] = value;
        this.requestFullUpdate();
    }
}
