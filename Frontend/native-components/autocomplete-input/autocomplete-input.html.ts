import { html } from 'lit-element';
import { AutocompleteInput } from './autocomplete-input';

export function renderAutocompleteInput(this: AutocompleteInput) {
    return html`
        <input
            id="search-field"
            type="text"
            .value="${this.value?.text ?? ''}"
            placeholder="${this.placeholder ?? ''}"
            @input="${(e: Event) => this.handleInput(e)}"
            @keydown="${(e: KeyboardEvent) => this.handleKeyDown(e)}"
            @blur="${() => setTimeout(() => this.selectItem(this.value), 200)}"
        />
        ${this.showDropdown
            ? html`<div id="dropdown">
                  ${this.searchResult?.map(
                      (item) =>
                          html`
                              <div
                                  class="option"
                                  ?selected="${this.value && this.value.id == item.id}"
                                  ?focused="${this.focusedItem && item.id == this.focusedItem.id}"
                                  @click="${() => this.selectItem(item)}"
                              >
                                  ${item.text}
                              </div>
                          `
                  )}
              </div>`
            : ''}
    `;
}
