import { html } from 'lit-element';
import { ObscuritasMediaManager } from './obscuritas-media-manager';

export function renderObscuritasMediaManager(this: ObscuritasMediaManager) {
    if (!this.initialized) return html``;
    return html`<page-routing defaultFragment="welcome" id="${this.initialized ? 'active' : 'inactive'}"></page-routing> `;
}
