import { html } from 'lit-element';
import { WarningBanner } from './warning-banner';

/**
 * @param { WarningBanner } warningBanner
 */
export function renderWarningBanner(warningBanner: WarningBanner) {
    return html`${warningBanner.inner}
        <div class="banner-x-button" @click="${() => (warningBanner.dismissed = true)}">&times;</div> `;
}
