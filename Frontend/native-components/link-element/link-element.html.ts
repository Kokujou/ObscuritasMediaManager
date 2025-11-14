import { html } from 'lit';
import { LinkElement } from './link-element';

export function renderLinkElement(this: LinkElement) {
    return html`
        <a target="${this.target ?? '_self'}" @click="${(e: MouseEvent) => this.handleClick(e)}" href="${this.fullLink}">
            <slot></slot
        ></a>
    `;
}
