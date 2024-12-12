import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { ModelCreationState } from '../../obscuritas-media-manager-backend-client';
import { renderEntityStatusDialogStyles } from './entity-status-dialog.css';
import { renderEntityStatusDialog } from './entity-status-dialog.html';

/**
 * @typedef {Object} EntityStatusEntry
 * @prop {string | TemplateResult} text
 * @prop {ModelCreationState} status
 */
@customElement('entity-status-dialog')
export class EntityStatusDialog extends LitElementBase {
    static override get styles() {
        return renderEntityStatusDialogStyles();
    }

    /**
     * @param {((dialog: EntityStatusDialog) => boolean)} isComplete
     */
    static show(isComplete: ((dialog: EntityStatusDialog) => boolean)) {
        var dialog = new EntityStatusDialog();
        dialog.isComplete = isComplete;

        document.body.append(dialog);
        dialog.requestFullUpdate();

        return dialog;
    }

    constructor() {
        super();
        /** @type {EntityStatusEntry[]} */ this.entries = [];
        /** @type {(dialog: EntityStatusDialog) => boolean } */ this.isComplete = () => false;
    }

    override render() {
        return renderEntityStatusDialog(this);
    }

    /**
     * @param {EntityStatusEntry} entry,
     */
    async addEntry(entry: EntityStatusEntry) {
        this.entries.push(entry);

        await this.requestFullUpdate();
        this.shadowRoot!.querySelector('#entries').scrollTop = 50000;
    }
}
