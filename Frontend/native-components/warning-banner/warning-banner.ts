import { TemplateResult } from 'lit-element';
import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderWarningBannerStyles } from './warning-banner.css';
import { renderWarningBanner } from './warning-banner.html';

@customElement('warning-banner')
export class WarningBanner extends LitElementBase {
    static override get styles() {
        return renderWarningBannerStyles();
    }

    static instance: WarningBanner | null;

    static spawn(inner: TemplateResult) {
        if (this.instance) return;
        var banner = new WarningBanner();
        banner.inner = inner;
        banner.requestFullUpdate();

        PageRouting.instance.prepend(banner);
        this.instance = banner;
    }

    static remove() {
        this.instance?.remove();
    }

    dismissed: boolean;
    inner: TemplateResult | string;

    override render() {
        return renderWarningBanner.call(this);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        WarningBanner.instance = null;
    }
}
