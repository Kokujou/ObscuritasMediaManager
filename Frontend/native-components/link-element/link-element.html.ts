import { html } from 'lit';
import { LinkElement } from './link-element';

export function renderLinkElement(this: LinkElement) {
    return html`
        <div id="link">
            <slot></slot>
        </div>
    `;
}
