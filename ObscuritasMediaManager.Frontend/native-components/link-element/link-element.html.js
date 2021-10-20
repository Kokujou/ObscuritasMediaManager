import { html } from '../../exports.js';
import { LinkElement } from './link-element.js';

/**
 * @param { LinkElement } linkElement
 */
export function renderLinkElement(linkElement) {
    return html` <a .href="${linkElement.fullLink}" @click="${(e) => linkElement.handleClick(e)}"> <slot></slot></a> `;
}
