import { html } from 'lit-element';
import { ContextTooltip } from './context-tooltip';

export function renderContextTooltip(this: ContextTooltip) {
    return this.items.map((item) => html`<div class="item" @click="${() => this.resolve(item)}">${item.text}</div>`);
}
