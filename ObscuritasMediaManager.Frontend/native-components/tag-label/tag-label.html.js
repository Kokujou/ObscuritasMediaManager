import { html } from '../../exports.js';
import { TagLabel } from './tag-label.js';

/**
 * @param {TagLabel} tagLabel
 */
export function renderTagLabel(tagLabel) {
    return html`
        <div id="label-container" @click="${(e) => e.stopPropagation()}">
            ${tagLabel.createNew ? renderNewLabelForm(tagLabel) : html`<div id="label-text">${tagLabel.text}</div>`}
            <div id="x-button" @click="${(e) => tagLabel.notifyRemoved(e)}">&times</div>
        </div>
    `;
}

/**
 * @param {TagLabel} tagLabel
 */
function renderNewLabelForm(tagLabel) {
    return html`<form id="new-label-form" action="javascript:void(0)">
        <input
            id="new-tag-input"
            @keyup="${(e) => tagLabel.handleInput(e)}"
            @input="${() => tagLabel.requestUpdate(undefined)}"
            @focus="${() => (tagLabel.showAutocomplete = true)}"
            @focusout="${() => (tagLabel.showAutocomplete = false)}"
            type="text"
            autocomplete="off"
        />

        <div id="autocomplete-list" class="${tagLabel.showAutocomplete ? '' : 'hidden'}">
            ${tagLabel.autocompleteItems.map(
                (x, index) => html`<div
                    class="autocomplete-item ${tagLabel.autofillIndex == index ? 'active' : ''}"
                    @pointerover="${() => {
                        tagLabel.autofillIndex = index;
                        tagLabel.requestUpdate(undefined);
                    }}"
                    @pointerdown="${() => tagLabel.setSearchText(x)}"
                >
                    ${x}
                </div> `
            )}
        </div>
        <div id="invisible-text">
            ${
                /** @type {HTMLInputElement} */ (tagLabel.shadowRoot.querySelector('#new-tag-input'))?.value.replaceAll(
                    ' ',
                    '\xA0'
                )
            }
        </div>
    </form>`;
}
