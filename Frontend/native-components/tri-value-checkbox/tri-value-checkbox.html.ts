import { html } from 'lit-element';
import { TriValueCheckbox } from './tri-value-checkbox';

export function renderTriValueCheckboxStyles(this: TriValueCheckbox) {
    return html`
        <div class="checkbox " @click="${() => this.nextState()}">
            <slot></slot>
        </div>
    `;
}
