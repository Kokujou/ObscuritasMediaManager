import { html } from '../../exports.js';
import { MessageSnackbar } from './message-snackbar.js';

/**
 * @param { MessageSnackbar } messageSnackbar
 */
export function renderMessageSnackbar(messageSnackbar) {
    return html`
        <div id="message-text">${messageSnackbar.message}</div>
        <div id="x-button" @click="${() => messageSnackbar.dismiss()}">&times;</div>
    `;
}
