import { html } from 'lit';
import { LinkElement } from './link-element';

export function renderLinkElement(this: LinkElement) {
    return html`
        <div
            id="link"
            target="${this.target ?? '_self'}"
            @click="${(e: MouseEvent) => this.handleClick(e)}"
            @pointerdown="${(e: MouseEvent) => (e.button == 1 ? e.preventDefault() : null)}"
            @pointerup="${this.handleMiddleButton}"
            href="${this.fullLink}"
        >
            <slot></slot>
        </div>
    `;
}
