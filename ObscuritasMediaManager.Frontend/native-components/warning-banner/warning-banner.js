import { LitElementBase } from '../../data/lit-element-base.js';
import { TemplateResult } from '../../exports.js';
import { renderWarningBannerStyles } from './warning-banner.css.js';
import { renderWarningBanner } from './warning-banner.html.js';

export class WarningBanner extends LitElementBase {
    static get styles() {
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

    render() {
        return renderWarningBanner(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        WarningBanner.instance = null;
    }
}
