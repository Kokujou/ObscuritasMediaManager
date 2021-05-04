import { html } from '../../exports.js';
import { PathInputDialog } from './path-input-dialog.js';

/**
 * @param {PathInputDialog} dialog
 */
export function renderPathInputDialog(dialog) {
    return html` <dialog-base
        caption="Bitte Basispfad auswählen"
        @decline="${() => dialog.notifyDeclined()}"
        @accept="${() => dialog.notifyAccepted()}"
    >
        <div id="dialog-content">
            <div id="input-description">Bitte den Basispfad des ausgewählten Ordners eingeben:</div>
            <input type="text" id="base-path-input" />
        </div>
    </dialog-base>`;
}
