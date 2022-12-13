import { html } from '../../exports.js';
import { MessageDialog } from './message-dialog.js';

/**
 * @param {MessageDialog} messageDialog
 */
export function renderMessageDialog(messageDialog) {
    return html`
        <dialog-base
            @accept="${() => messageDialog.dispatchCustomEvent('accept')}"
            @decline="${() => messageDialog.dispatchCustomEvent('decline')}"
            >${messageDialog.message}</dialog-base
        >
    `;
}
