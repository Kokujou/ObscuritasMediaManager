import { html } from '../../exports.js';
import { ContextTooltip } from './context-tooltip.js';

/**
 * @param { ContextTooltip } tooltip
 */
export function renderContextTooltip(tooltip) {
    return tooltip.items.map((item) => html`<div class="item" @click="${() => tooltip.resolve(item)}">${item.text}</div>`);
}
