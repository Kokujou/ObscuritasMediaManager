import { html } from 'lit-element';
import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { changePage, getPageName } from '../../services/extensions/url.extension';
import { renderLinkElementStyles } from './link-element.css';
import { renderLinkElement } from './link-element.html';

@customElement('link-element')
export class LinkElement extends LitElementBase {
    static override get styles() {
        return renderLinkElementStyles();
    }

    static get properties() {
        return {
            href: { type: String, reflect: true },
            id: { type: String, reflect: true },
            target: { type: String, reflect: true },
            page: { type: Object, reflect: true },
            params: { type: Object, reflect: true },
            disabled: { type: Boolean, reflect: true },
            class: { type: String, reflect: true },
        };
    }

    /**
     * @template {import('../../custom-elements').Page} T
     * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
     * @param {T} page
     * @param {Partial<Pick<U, import('../../services/extensions/url.extension').NonMethodKeys<U>>>} params
     * @param {TemplateResult | string} inner
     * @param {Partial<Record<keyof LinkElement.properties, any>>} options
     */
    static forPage(page, params, inner, options = {}) {
        return html`<link-element
            id="${options.id}"
            .page="${page}"
            .params="${params}"
            ?disabled="${options.disabled}"
            .target="${options.target}"
            .class="${options.class}"
        >
            ${inner}
        </link-element>`;
    }

    /**
     * @template {import('../../custom-elements').Page} T
     * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
     * @param {T} page
     * @param {Partial<Pick<U, import('../../services/extensions/url.extension').NonMethodKeys<U>>>} params
     */
    static getLinkFor(page, params) {
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
        var link = this.href ?? '';
        return LinkElement.getLinkFor(this.page, this.params);
    }

    constructor() {
        super();

        this.href = null;
        this.target = null;
        /** @type {import('../../custom-elements').Page} */ this.page = null;
        /** @type {Object.<string, any>} */ this.params = null;
        this.disabled = false;
    }

    override render() {
        return renderLinkElement(this);
    }

    /**
     * @param {Event} event
     */
    handleClick(event) {
        if (this.target == '_blank') return;
        event.preventDefault();
        if (this.disabled) return;

        if (this.href) location.assign(this.fullLink);
        else changePage(this.page, this.params);

        return false;
    }
}
