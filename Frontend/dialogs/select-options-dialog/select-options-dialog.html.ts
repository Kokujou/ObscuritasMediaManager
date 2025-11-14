import { html } from 'lit';
import { SelectOptionsDialog } from './select-options-dialog';

export function renderSelectOptionsDialog(this: SelectOptionsDialog) {
    return html`
        <dialog-base
            showBorder
            canAccept
            caption="Make your choice"
            acceptActionText="Auswählen"
            declineActionText="Abbrechen"
            ?canAccept="${this.isComplete()}"
            @accept="${(e: Event) => this.accept(e)}"
        >
            <div id="content">
                <div id="items">
                    ${Object.keys(this.options).map(
                        (key) =>
                            html`<div class="option">
                                <input id="${key}" type="${this.multiselect ? 'checkbox' : 'radio'}" .value="${key}" checked />
                                <label for="${key}">${this.options[key]}</label>
                            </div>`
                    )}
                    ${!this.isComplete() ? html`<loading-circle></loading-circle>` : ''}
                </div>
            </div>
        </dialog-base>
    `;
}
