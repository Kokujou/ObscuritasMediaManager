import { html } from 'lit-element';
import { LinkElement } from './link-element';

/**
 * @param { LinkElement } linkElement
 */
export function renderLinkElement(linkElement: LinkElement) {
    return html`
        <a
            target="${linkElement.target ?? '_self'}"
            @click="${(e: Event) => linkElement.handleClick(e)}"
            href="${linkElement.fullLink}"
        >
            <slot></slot
        ></a>
    `;
}
