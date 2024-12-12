import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderWarningBannerStyles } from './warning-banner.css';
import { renderWarningBanner } from './warning-banner.html';

@customElement('warning-banner')
export class WarningBanner extends LitElementBase {
    static override get styles() {
        return renderWarningBannerStyles();
    }

    static get properties() {
        return {
            dismissed: { type: Boolean, reflect: true },
            inner: { type: Object, reflect: true },
        };
    }

    /** @type {WarningBanner} */ static instance;

    /**
     * @param {TemplateResult} inner
     */
    static spawn(inner) {
        if (this.instance) return;
        var banner = new WarningBanner();
        banner.inner = inner;
        banner.requestFullUpdate();

        document.body.prepend(banner);
        this.instance = banner;
    }

    static remove() {
        this.instance?.remove();
    }

    constructor() {
        super();

        /** @type {boolean} */ this.dismissed;
        /** @type {TemplateResult} */ this.inner;
    }

    override render() {
        return renderWarningBanner(this);
    }

    disoverride connectedCallback() {
        super.disconnectedCallback();
        WarningBanner.instance = null;
    }
}
