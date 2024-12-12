import { html } from 'lit-element';
import { TriValueCheckbox } from './tri-value-checkbox';

/**
 * @param {TriValueCheckbox} checkbox
 */
export function renderTriValueCheckboxStyles(checkbox: TriValueCheckbox) {
    return html`
        <div class="checkbox " @click="${() => checkbox.nextState()}">
            <slot></slot>
        </div>
    `;
}
