import { html } from '../../exports.js';
import { TagLabel } from './tag-label.js';

/**
 * @param {TagLabel} tagLabel
 */
export function renderTagLabel(tagLabel) {
    return html`
        <div class="label-container" @click="${(e) => e.stopPropagation()}">
            ${tagLabel.createNew ? renderNewLabelForm(tagLabel) : html`<div class="label-text">${tagLabel.text}</div>`}

            <div class="x-button" @click="${(e) => tagLabel.notifyRemoved(e)}">&times</div>
        </div>
    `;
}

/**
 * @param {TagLabel} tagLabel
 */
function renderNewLabelForm(tagLabel) {
    return html`<form class="new-label-form" action="javascript:void(0)" @submit="${() => tagLabel.notifyTagCreated()}">
        <input
            id="new-tag-input"
            @keyup="${() => tagLabel.requestUpdate(undefined)}"
            @input="${() => tagLabel.requestUpdate(undefined)}"
            type="text"
        />
        <div class="invisible-text">
            ${tagLabel.shadowRoot
                .querySelector('#new-tag-input')
                // @ts-ignore
                ?.value.replaceAll(' ', '\xA0')}
        </div>
    </form>`;
}
