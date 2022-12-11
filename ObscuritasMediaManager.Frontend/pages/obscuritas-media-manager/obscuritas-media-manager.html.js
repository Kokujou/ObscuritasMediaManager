import { html } from '../../exports.js';
import { ObscuritasMediaManager } from './obscuritas-media-manager.js';

/**
 * @param {ObscuritasMediaManager} mediaManager
 */
export function renderObscuritasMediaManager(mediaManager) {
    if (!mediaManager.initialized) return '';
    return html`<page-routing
        defaultFragment="welcome"
        id="${mediaManager.initialized ? 'active' : 'inactive'}"
    ></page-routing> `;
}
