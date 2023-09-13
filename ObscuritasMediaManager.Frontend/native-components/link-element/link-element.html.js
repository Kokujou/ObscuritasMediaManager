import { html } from '../../exports.js';
import { LinkElement } from './link-element.js';

/**
 * @param { LinkElement } linkElement
 */
export function renderLinkElement(linkElement) {
    return html` <a @click="${(e) => linkElement.handleClick(e)}" href="${linkElement.fullLink}"> <slot></slot></a> `;
}
