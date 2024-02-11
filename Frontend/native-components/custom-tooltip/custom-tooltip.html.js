import { html } from '../../exports.js';
import { CustomTooltip } from './custom-tooltip.js';

/**
 * @param {CustomTooltip} tooltip
 */
export function renderTooltip(tooltip) {
    return html` <div id="tooltip">${tooltip.text}</div> `;
}
