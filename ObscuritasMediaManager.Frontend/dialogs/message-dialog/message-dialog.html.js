import { html } from '../../exports.js';
import { MessageDialog } from './message-dialog.js';

/**
 * @param {MessageDialog} messageDialog
 */
export function renderMessageDialog(messageDialog) {
    return html`
        <dialog-base
            @accept="${() => messageDialog.dispatchEvent(new CustomEvent('accept'))}"
            @decline="${() => messageDialog.dispatchEvent(new CustomEvent('decline'))}"
            >${messageDialog.message}</dialog-base
        >
    `;
}
