import { html } from '../../exports.js';
import { TriValueCheckbox } from './tri-value-checkbox.js';

/**
 * @param {TriValueCheckbox} checkbox
 */
export function renderTriValueCheckboxStyles(checkbox) {
    return html` <div class="checkbox ${checkbox.value}" @click="${() => checkbox.nextState()}"><slot></slot></div> `;
}
