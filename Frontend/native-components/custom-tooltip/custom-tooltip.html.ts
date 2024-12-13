import { html } from 'lit-element';
import { CustomTooltip } from './custom-tooltip';

export function renderTooltip(this: CustomTooltip) {
    return html` <div id="tooltip">${this.text}</div> `;
}
