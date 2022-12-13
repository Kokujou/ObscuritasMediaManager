import { html } from '../../exports.js';
import { InputDialog } from './input-dialog.js';

/**
 * @param {InputDialog} dialog
 */
export function renderInputDialog(dialog) {
    return html` <dialog-base
        caption="Bitte Basispfad auswählen"
        @decline="${() => dialog.notifyDeclined()}"
        @accept="${() => dialog.notifyAccepted()}"
    >
        <div id="dialog-content">
            <div id="input-description">${dialog.message}</div>
            <input type="text" id="base-path-input" />
        </div>
    </dialog-base>`;
}
