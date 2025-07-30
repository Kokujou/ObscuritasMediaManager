import { html } from 'lit-element';
import { TagLabel } from './tag-label';

export function renderTagLabel(this: TagLabel) {
    return html`
        <div id="label-container" @click="${(e: Event) => e.stopPropagation()}">
            ${this.createNew ? renderNewLabelForm.call(this) : html`<div id="label-text">${this.text}</div>`}
            <div id="x-button" @click="${(e: Event) => this.notifyRemoved(e)}">&times;</div>
        </div>
    `;
}

function renderNewLabelForm(this: TagLabel) {
    return html`<form id="new-label-form" action="javascript:void(0)">
        <input
            id="new-tag-input"
            placeholder="${this.placeholder ?? ''}"
            @keydown="${(e: KeyboardEvent) => this.handleInput(e)}"
            @input="${() => this.requestFullUpdate()}"
            @focus="${() => (this.showAutocomplete = true)}"
            @focusout="${() => (this.showAutocomplete = false)}"
            type="text"
            autocomplete="off"
        />

        <div id="autocomplete-list" class="${this.showAutocomplete ? '' : 'hidden'}">
            ${this.autocompleteItems.map(
                (x, index) => html`<div
                    class="autocomplete-item ${this.autofillIndex == index ? 'active' : ''}"
                    @pointerover="${() => {
                        this.autofillIndex = index;
                        this.requestFullUpdate();
                    }}"
                    @pointerdown="${() => this.setSearchText(x)}"
                >
                    ${x}
                </div> `
            )}
        </div>
        <div id="invisible-text">
            ${(this.shadowRoot!.querySelector('#new-tag-input') as HTMLInputElement)?.value.replaceAll(' ', '\xA0')}
        </div>
    </form>`;
}
