import { html } from 'lit';
import { CustomTooltip } from './custom-tooltip';

export function renderTooltip(this: CustomTooltip) {
    return html` <div id="tooltip">${this.text}</div> `;
}
