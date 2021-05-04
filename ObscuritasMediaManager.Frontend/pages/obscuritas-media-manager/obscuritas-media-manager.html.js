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
        ></page-routing>
        ${renderLoadingIcon(mediaManager)} `;
}

/**
 * @param {ObscuritasMediaManager} mediaManager
 */
function renderLoadingIcon(mediaManager) {
    return html`<div id="loading-overlay ${mediaManager.initialized ? 'inactive' : 'active'}">
        <div id="loading-icon outer"></div>
        <div id="loading-icon inner-1"></div>
        <div id="loading-icon inner-2"></div>
        <div id="loading-icon inner-3"></div>
    </div>`;
}
