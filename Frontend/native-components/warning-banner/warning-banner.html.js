import { html } from '../../exports.js';
import { WarningBanner } from './warning-banner.js';

/**
 * @param { WarningBanner } warningBanner
 */
export function renderWarningBanner(warningBanner) {
    return html`${warningBanner.inner}
        <div class="banner-x-button" @click="${() => (warningBanner.dismissed = true)}">&times;</div> `;
}
