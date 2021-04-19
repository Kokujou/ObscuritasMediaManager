import { getRoutes } from '../../data/pages.js';
import { html } from '../../exports.js';
import { ObscuritasMediaManager } from './obscuritas-media-manager.js';

/**
 * @param {ObscuritasMediaManager} mediaManager
 */
export function renderObscuritasMediaManager(mediaManager) {
    return html`<page-routing
            .routes="${getRoutes()}"
            defaultFragment="welcome"
            class="${mediaManager.initialized ? 'active' : 'inactive'}"
        ></page-routing>
        ${renderLoadingIcon(mediaManager)} `;
}

/**
 * @param {ObscuritasMediaManager} mediaManager
 */
function renderLoadingIcon(mediaManager) {
    return html`<div class="loading-overlay ${mediaManager.initialized ? 'inactive' : 'active'}">
        <div class="loading-icon outer"></div>
        <div class="loading-icon inner-1"></div>
        <div class="loading-icon inner-2"></div>
        <div class="loading-icon inner-3"></div>
    </div>`;
}
