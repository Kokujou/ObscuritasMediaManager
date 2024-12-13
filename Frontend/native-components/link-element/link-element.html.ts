import { html } from 'lit-element';
import { LinkElement } from './link-element';

export function renderLinkElement(this: LinkElement) {
    return html`
        <a target="${this.target ?? '_self'}" @click="${(e: Event) => this.handleClick(e)}" href="${this.fullLink}">
            <slot></slot
        ></a>
    `;
}
