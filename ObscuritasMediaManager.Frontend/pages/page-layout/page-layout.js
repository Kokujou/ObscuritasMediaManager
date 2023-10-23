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

    constructor() {
        super();
        this.clientInteropSocketFailed = false;
    }

    render() {
        return renderPageLayout();
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(
            ClientInteropService.failCounter.subscribe((x) => {
                if (this.clientInteropSocketFailed == false && x >= 1) {
                    WarningBanner.spawn(html`
                        Die Socket-Verbindung zum Client ist fehlgeschlagen. Bitte starte das&nbsp;
                        <a class="banner-link">Client-Programm</a>.
                    `);
                    this.clientInteropSocketFailed = true;
                }

                if (x < 1) {
                    WarningBanner.remove();
                    this.clientInteropSocketFailed = false;
                }
            })
        );
    }
}
