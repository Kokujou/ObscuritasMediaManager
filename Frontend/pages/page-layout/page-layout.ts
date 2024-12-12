import { html } from 'lit-element';
import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { WarningBanner } from '../../native-components/warning-banner/warning-banner';
import { ClientInteropService } from '../../services/client-interop-service';
import { renderWebcomponentTemplateStyles as renderPageLayoutStyles } from './page-layout.css';
import { renderPageLayout } from './page-layout.html';

@customElement('page-layout')
export class PageLayout extends LitElementBase {
    static override get styles() {
        return renderPageLayoutStyles();
    }

    static get properties() {
        return {
            clientInteropSocketFailed: { type: Boolean, reflect: true },
        };
    }

    override render() {
        return renderPageLayout();
    }

    override connectedCallback() {
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
            }, true)
        );
    }

    openClientProgram() {
        var iframe = document.createElement('iframe');
        iframe.src = 'ommci://';
        document.body.appendChild(iframe);
        iframe.remove();
    }
}
