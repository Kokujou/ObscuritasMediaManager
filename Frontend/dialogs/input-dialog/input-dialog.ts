import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderInputDialogStyles } from './input-dialog.css';
import { renderInputDialog } from './input-dialog.html';

@customElement('input-dialog')
export class InputDialog extends LitElementBase {
    static override get styles() {
        return renderInputDialogStyles();
    }

    static show(caption: string, message: string) {
        return new Promise<string | null>((resolve) => {
            var dialog = new InputDialog();
            dialog.resolve = resolve;
            dialog.caption = caption;
            dialog.message = message;
            PageRouting.container!.append(dialog);
            dialog.requestFullUpdate();
            return dialog;
        });
    }

    declare resolve: (result: string | null) => void;
    declare caption: string;
    declare message: string;

    override render() {
        return renderInputDialog.call(this);
    }

    async notifyAccepted() {
        var input = this.shadowRoot!.querySelector('#base-path-input') as HTMLInputElement;
        this.resolve(input.value);
        this.remove();
    }

    notifyDeclined() {
        this.resolve(null);
        this.remove();
    }
}
