import { html } from 'lit';
import { WarningBanner } from './warning-banner';

export function renderWarningBanner(this: WarningBanner) {
    return html`${this.inner}
        <div class="banner-x-button" @click="${() => (this.dismissed = true)}">&times;</div> `;
}
