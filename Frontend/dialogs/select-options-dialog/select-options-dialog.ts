import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderSelectOptionsDialogStyles } from './select-options-dialog.css';
import { renderSelectOptionsDialog } from './select-options-dialog.html';

@customElement('select-options-dialog')
export class SelectOptionsDialog extends LitElementBase {
    static override get styles() {
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
    static show(options: { [s: string]: TemplateResult | string; }, multiselect = true) {
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
    static startShowing(isComplete: () => boolean, multiselect = true) {
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

    override render() {
        return renderSelectOptionsDialog(this);
    }

    /** @param {Event} e */
    accept(e: Event) {
        e.stopPropagation();
        /** @type {NodeListOf<HTMLInputElement>} */ var checkedInputs = this.shadowRoot!.querySelectorAll('input:checked');
        var selectedIds = [];
        for (var input of checkedInputs) selectedIds.push(input.value);
        this.dispatchEvent(new CustomEvent('accept', { detail: { selected: selectedIds } }));
    }

    /**
     *
     * @param {string} key
     * @param {TemplateResult | string} value
     */
    addEntry(key: string, value: TemplateResult | string) {
        this.options[key] = value;
        this.requestFullUpdate();
    }
}
