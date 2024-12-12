import { html } from 'lit-element';
import { ContextTooltip } from './context-tooltip';

/**
 * @param { ContextTooltip } tooltip
 */
export function renderContextTooltip(tooltip) {
    return tooltip.items.map((item) => html`<div class="item" @click="${() => tooltip.resolve(item)}">${item.text}</div>`);
}
