import { html } from 'lit-element';
import { ModelCreationState } from '../../obscuritas-media-manager-backend-client';
import { EntityStatusDialog } from './entity-status-dialog';

/**
 * @param { EntityStatusDialog } dialog
 */
export function renderEntityStatusDialog(dialog) {
    return html`
        <dialog-base caption="Fortschritt" acceptActionText="Weiter" ?canAccept="${dialog.isComplete(dialog)}" showBorder>
            <div id="entries">
                ${dialog.entries.map(
                    (entry) => html`<div class="entry" status="${entry.status}">
                        <div class="entry-text">${entry.text}</div>
                        <div class="entry-status">${entry.status == ModelCreationState.Loading ? null : entry.status}</div>
                    </div>`
                )}
                ${!dialog.isComplete(dialog)
                    ? html` <loading-circle id="entries-loading-indication" class="entry"></loading-circle> `
                    : ''}
            </div>
        </dialog-base>
    `;
}
