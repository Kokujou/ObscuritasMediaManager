import { html, TemplateResult } from 'lit-element';
import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Page } from '../../data/util-types';
import { changePage, getPageName } from '../../services/extensions/url.extension';
import { renderLinkElementStyles } from './link-element.css';
import { renderLinkElement } from './link-element.html';

@customElement('link-element')
export class LinkElement extends LitElementBase {
    static override get styles() {
        return renderLinkElementStyles();
    }

    static forPage<T extends Page, U extends Omit<InstanceType<T>, keyof LitElementBase>>(
        page: T,
        params: Partial<Pick<U, import('../../services/extensions/url.extension').NonMethodKeys<U>>> | null,
        inner: TemplateResult | string,
        options: Partial<Record<keyof typeof LinkElement.properties, any>> = {}
    ) {
        return html`<link-element
            id="${options.id}"
            .page="${page as any}"
            .params="${params}"
            ?disabled="${options.disabled}"
            .target="${options.target}"
            .class="${options.class}"
        >
            ${inner}
        </link-element>`;
    }

    static getLinkFor<T extends Page, U extends Omit<InstanceType<T>, keyof LitElementBase> | undefined>(
        page: T | undefined,
        params: Partial<Pick<U, import('../../services/extensions/url.extension').NonMethodKeys<U>>>
    ) {
        var link = '';
        if (params)
            link += `?${Object.entries(params)
                .map((x) => `${x[0]}=${x[1]}`)
                .join('&')}`;
        if (page) link += `#${getPageName(page)}`;
        return link;
    }

    get fullLink() {
        if (this.href) return this.href;
        return LinkElement.getLinkFor(this.page, this.params);
    }

    @property() href?: string = undefined;
    @property() target?: string = undefined;
    @property({ type: Object }) page?: Page = undefined;
    @property() params: any = null;
    @property({ type: Boolean }) disabled = false;

    override render() {
        return renderLinkElement.call(this);
    }

    handleClick(event: Event) {
        if (this.target == '_blank') return;
        event.preventDefault();
        if (this.disabled) return;

        if (this.href) location.assign(this.fullLink);
        else if (this.page) changePage(this.page, this.params);

        return false;
    }
}
