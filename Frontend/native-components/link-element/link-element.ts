import { html, TemplateResult } from 'lit';
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
        options: Partial<Record<keyof LinkElement, any>> = {},
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
        params: Partial<Pick<U, import('../../extensions/url.extension').NonMethodKeys<U>>>,
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

    @property() declare public href?: string;
    @property() declare public target?: string;
    @property({ type: Object }) declare public page?: Page;
    @property({ type: Object }) declare public params: any;
    @property({ type: Boolean, reflect: true }) declare public disabled: boolean;

    connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener('click', this.handleClick);
        this.addEventListener('pointerdown', (e) => e.preventDefault());
        this.addEventListener('auxclick', (e) =>
            e.button == 1 ? window.open(this.fullLink, '_blank', 'noopener,noreferrer') : null,
        );
    }

    override render() {
        return renderLinkElement.call(this);
    }

    handleClick(event: MouseEvent) {
        if (this.target == '_blank') return;
        if (this.disabled) return;
        if (event.button != 0) return;
        event.preventDefault();

        if (this.href) location.assign(this.fullLink);
        else if (this.page) changePage(this.page, this.params);

        return false;
    }
}
