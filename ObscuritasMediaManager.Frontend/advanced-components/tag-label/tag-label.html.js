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
    return html`<form id="new-label-form" action="javascript:void(0)" @submit="${() => tagLabel.notifyTagCreated()}">
        <input
            id="new-tag-input"
            @keyup="${() => tagLabel.requestUpdate(undefined)}"
            @input="${() => tagLabel.requestUpdate(undefined)}"
            type="text"
        />
        <div id="invisible-text">
            ${tagLabel.shadowRoot
                .querySelector('#new-tag-input')
                // @ts-ignore
                ?.value.replaceAll(' ', '\xA0')}
        </div>
    </form>`;
}
