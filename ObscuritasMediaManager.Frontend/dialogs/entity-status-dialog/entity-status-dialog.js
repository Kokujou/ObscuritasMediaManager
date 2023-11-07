import { LitElementBase } from '../../data/lit-element-base.js';
import { TemplateResult } from '../../exports.js';
import { ModelCreationState } from '../../obscuritas-media-manager-backend-client.js';
import { renderEntityStatusDialogStyles } from './entity-status-dialog.css.js';
import { renderEntityStatusDialog } from './entity-status-dialog.html.js';

/**
 * @typedef {Object} EntityStatusEntry
 * @prop {string | TemplateResult} text
 * @prop {ModelCreationState} status
 */

export class EntityStatusDialog extends LitElementBase {
    static get styles() {
        return renderEntityStatusDialogStyles();
    }

    /**
     * @param {((dialog: EntityStatusDialog) => boolean)} isComplete
     */
    static show(isComplete) {
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

    render() {
        return renderEntityStatusDialog(this);
    }

    /**
     * @param {EntityStatusEntry} entry,
     */
    async addEntry(entry) {
        this.entries.push(entry);

        await this.requestFullUpdate();
        this.shadowRoot.querySelector('#entries').scrollTop = 50000;
    }
}
