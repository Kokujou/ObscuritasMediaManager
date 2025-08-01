import { html, TemplateResult } from 'lit-element';
import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Page } from '../../data/util-types';
import { changePage, getPageName } from '../../extensions/url.extension';
import { renderLinkElementStyles } from './link-element.css';
import { renderLinkElement } from './link-element.html';

type PageParams<U> = Pick<U, import('../../extensions/url.extension').NonMethodKeys<U>>;

@customElement('link-element')
export class LinkElement extends LitElementBase {
    static override get styles() {
        return renderLinkElementStyles();
    }

    static forPage<T extends Page, U extends Omit<InstanceType<T>, keyof LitElementBase>>(
        page: T,
        params: Partial<PageParams<U>> | null,
        inner: TemplateResult | string,
        options: Partial<Record<keyof LinkElement, any>> = {}
    ) {
        return html`<link-element
            id="${options.id}"
            .page="${page as any}"
            .params="${params}"
            ?disabled="${options.disabled}"
            .target="${options.target}"
            class="${options.className}"
        >
            ${inner}
        </link-element>`;
    }

    static getLinkFor<T extends Page, U extends Omit<InstanceType<T>, keyof LitElementBase> | undefined>(
        page: T | undefined,
        params: Partial<Pick<U, import('../../extensions/url.extension').NonMethodKeys<U>>>
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

    @property() public declare href?: string;
    @property() public declare target?: string;
    @property({ type: Object }) public declare page?: Page;
    @property({ type: Object }) public declare params: any;
    @property({ type: Boolean, reflect: true }) public declare disabled: boolean;

    override render() {
        return renderLinkElement.call(this);
    }

    handleClick(event: MouseEvent) {
        if (this.target == '_blank') return;
        if (event.button == 0) event.preventDefault();
        if (this.disabled) return;

        if (this.href) location.assign(this.fullLink);
        else if (this.page) changePage(this.page, this.params);

        return false;
    }
}
