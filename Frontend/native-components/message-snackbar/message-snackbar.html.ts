import { html } from 'lit';
import { MessageSnackbar } from './message-snackbar';

export function renderMessageSnackbar(this: MessageSnackbar) {
    return html`
        <div id="message-text">${this.message}</div>
        <div id="x-button" @click="${() => this.dismiss()}">&times;</div>
    `;
}
