import { html } from '../../exports.js';
import { ScrollSelect } from './scroll-select.js';

/**
 * @param {ScrollSelect} scrollSelect
 */
export function renderScrollSelect(scrollSelect) {
    return html`
        <div id="scroll-container">
            <div id="scroll-items">${scrollSelect.options.map((x) => html`<div class="scroll-item">${x}</div>`)}</div>
        </div>
    `;
}
