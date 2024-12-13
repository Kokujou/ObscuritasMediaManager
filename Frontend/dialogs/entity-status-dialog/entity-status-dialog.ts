import { TemplateResult } from 'lit-element';
import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { ModelCreationState } from '../../obscuritas-media-manager-backend-client';
import { renderEntityStatusDialogStyles } from './entity-status-dialog.css';
import { renderEntityStatusDialog } from './entity-status-dialog.html';

export class EntityStatusEntry {
    text: string | TemplateResult;
    status: ModelCreationState;
}

@customElement('entity-status-dialog')
export class EntityStatusDialog extends LitElementBase {
    static override get styles() {
        return renderEntityStatusDialogStyles();
    }

    static show(isComplete: (dialog: EntityStatusDialog) => boolean) {
        var dialog = new EntityStatusDialog();
        dialog.isComplete = isComplete;

        document.body.append(dialog);
        dialog.requestFullUpdate();

        return dialog;
    }

    entries: EntityStatusEntry[] = [];
    isComplete = (dialog: EntityStatusDialog) => false;

    override render() {
        return renderEntityStatusDialog.call(this);
    }

    async addEntry(entry: EntityStatusEntry) {
        this.entries.push(entry);

        await this.requestFullUpdate();
        this.shadowRoot!.querySelector('#entries')!.scrollTop = 50000;
    }
}
