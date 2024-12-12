import { html } from 'lit-element';
import { ObscuritasMediaManager } from './obscuritas-media-manager';

/**
 * @param {ObscuritasMediaManager} mediaManager
 */
export function renderObscuritasMediaManager(mediaManager) {
    if (!mediaManager.initialized) return html``;
    return html`<page-routing
        defaultFragment="welcome"
        id="${mediaManager.initialized ? 'active' : 'inactive'}"
    ></page-routing> `;
}
