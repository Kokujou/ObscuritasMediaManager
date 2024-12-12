import { html } from 'lit-element';
import { CustomTooltip } from './custom-tooltip';

/**
 * @param {CustomTooltip} tooltip
 */
export function renderTooltip(tooltip) {
    return html` <div id="tooltip">${tooltip.text}</div> `;
}
