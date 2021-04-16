import { html } from '../../exports.js';
import { BorderButton } from './border-button.js';

/**
 * @param {BorderButton} borderButton
 */
export function renderBorderButton(borderButton) {
    return html`
        <div class="button-container">
            <div class="top left border"></div>
            <div class="top right border"></div>
            <div class="bottom left border"></div>
            <div class="bottom right border"></div>
            <div class="button">${borderButton.text}</div>
        </div>
    `;
}
