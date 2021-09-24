import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';
import { ObscuritasMediaManager } from './obscuritas-media-manager.js';

/**
 * @param {ObscuritasMediaManager} mediaManager
 */
export function renderObscuritasMediaManager(mediaManager) {
    return html`<page-routing
        .routes="${Pages}"
        defaultFragment="welcome"
        id="${mediaManager.initialized ? 'active' : 'inactive'}"
    ></page-routing> `;
}
