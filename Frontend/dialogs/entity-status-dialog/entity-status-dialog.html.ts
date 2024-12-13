import { html } from 'lit-element';
import { ModelCreationState } from '../../obscuritas-media-manager-backend-client';
import { EntityStatusDialog } from './entity-status-dialog';

export function renderEntityStatusDialog(this: EntityStatusDialog) {
    return html`
        <dialog-base caption="Fortschritt" acceptActionText="Weiter" ?canAccept="${this.isComplete(this)}" showBorder>
            <div id="entries">
                ${this.entries.map(
                    (entry) => html`<div class="entry" status="${entry.status}">
                        <div class="entry-text">${entry.text}</div>
                        <div class="entry-status">${entry.status == ModelCreationState.Loading ? null : entry.status}</div>
                    </div>`
                )}
                ${!this.isComplete(this)
                    ? html` <loading-circle id="entries-loading-indication" class="entry"></loading-circle> `
                    : ''}
            </div>
        </dialog-base>
    `;
}
