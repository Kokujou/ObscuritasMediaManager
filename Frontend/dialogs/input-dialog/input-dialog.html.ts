import { html } from 'lit-element';
import { InputDialog } from './input-dialog';

export function renderInputDialog(this: InputDialog) {
    return html` <dialog-base
        caption="${this.caption}"
        showBorder
        canAccept
        acceptActionText="Weiter"
        declineActionText="Abbrechen"
        @decline="${() => this.notifyDeclined()}"
        @accept="${() => this.notifyAccepted()}"
    >
        <div id="dialog-content">
            <div id="input-description">${this.message}</div>
            <input type="text" id="base-path-input" />
        </div>
    </dialog-base>`;
}
