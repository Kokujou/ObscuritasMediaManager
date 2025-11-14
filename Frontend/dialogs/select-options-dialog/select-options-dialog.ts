import { TemplateResult } from 'lit';
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

    static show(options: { [s: string]: TemplateResult | string }, multiselect = true) {
        var dialog = new SelectOptionsDialog();
        dialog.options = options;
        dialog.multiselect = multiselect;
        dialog.isComplete = () => true;

        PageRouting.container!.append(dialog);

        return dialog;
    }

    static startShowing(isComplete: () => boolean, multiselect = true) {
        var dialog = new SelectOptionsDialog();
        dialog.options = {};
        dialog.multiselect = multiselect;
        dialog.isComplete = isComplete;

        PageRouting.container!.append(dialog);

        return dialog;
    }
    options: { [key: string]: TemplateResult | string } = {};
    multiselect = true;
    isComplete = () => false;

    override render() {
        return renderSelectOptionsDialog.call(this);
    }

    accept(e: Event) {
        e.stopPropagation();
        var checkedInputs = this.shadowRoot!.querySelectorAll('input:checked') as NodeListOf<HTMLInputElement>;
        var selectedIds = [];
        for (var input of checkedInputs) selectedIds.push(input.value);
        this.dispatchEvent(new CustomEvent('accept', { detail: { selected: selectedIds } }));
    }

    addEntry(key: string, value: TemplateResult | string) {
        this.options[key] = value;
        this.requestFullUpdate();
    }
}
