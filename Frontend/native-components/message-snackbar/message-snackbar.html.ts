import { html } from 'lit-element';
import { MessageSnackbar } from './message-snackbar';

/**
 * @param { MessageSnackbar } messageSnackbar
 */
export function renderMessageSnackbar(messageSnackbar) {
    return html`
        <div id="message-text">${messageSnackbar.message}</div>
        <div id="x-button" @click="${() => messageSnackbar.dismiss()}">&times;</div>
    `;
}
