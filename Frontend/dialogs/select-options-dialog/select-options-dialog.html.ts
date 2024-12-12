import { html } from 'lit-element';
import { SelectOptionsDialog } from './select-options-dialog';

/**
 * @param { SelectOptionsDialog } dialog
 */
export function renderSelectOptionsDialog(dialog: SelectOptionsDialog) {
    return html`
        <dialog-base
            showBorder
            canAccept
            caption="Make your choice"
            acceptActionText="Auswählen"
            declineActionText="Abbrechen"
            ?canAccept="${dialog.isComplete()}"
            @accept="${(e: Event) => dialog.accept(e)}"
        >
            <div id="content">
                <div id="items">
                    ${Object.keys(dialog.options).map(
                        (key) =>
                            html`<div class="option">
                                <input id="${key}" type="${dialog.multiselect ? 'checkbox' : 'radio'}" .value="${key}" checked />
                                <label for="${key}">${dialog.options[key]}</label>
                            </div>`
                    )}
                    ${!dialog.isComplete() ? html`<loading-circle></loading-circle>` : ''}
                </div>
            </div>
        </dialog-base>
    `;
}
