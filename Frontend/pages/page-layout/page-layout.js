import { LitElementBase } from '../../data/lit-element-base.js';
import { html } from '../../exports.js';
import { WarningBanner } from '../../native-components/warning-banner/warning-banner.js';
import { ClientInteropService } from '../../services/client-interop-service.js';
import { renderWebcomponentTemplateStyles as renderPageLayoutStyles } from './page-layout.css.js';
import { renderPageLayout } from './page-layout.html.js';

export class PageLayout extends LitElementBase {
    static get styles() {
        return renderPageLayoutStyles();
    }

    static get properties() {
        return {
            clientInteropSocketFailed: { type: Boolean, reflect: true },
        };
    }

    render() {
        return renderPageLayout();
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(
            ClientInteropService.failCounter.subscribe((x) => {
                if (x >= 1) {
                    WarningBanner.spawn(html`
                        Die Socket-Verbindung zum Client ist fehlgeschlagen. Bitte starte das&nbsp;
                        <a class="banner-link" @click="${() => this.openClientProgram()}">Client-Programm</a>.
                    `);
                }

                if (x < 1) {
                    WarningBanner.remove();
                }
            })
        );
    }

    openClientProgram() {
        var iframe = document.createElement('iframe');
        iframe.src = 'ommci://';
        document.body.appendChild(iframe);
        iframe.remove();
    }
}
