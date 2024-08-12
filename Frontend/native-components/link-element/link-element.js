import { LitElementBase } from '../../data/lit-element-base.js';
import { html, TemplateResult } from '../../exports.js';
import { changePage, getPageName } from '../../services/extensions/url.extension.js';
import { renderLinkElementStyles } from './link-element.css.js';
import { renderLinkElement } from './link-element.html.js';

export class LinkElement extends LitElementBase {
    static get styles() {
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
     * @template {import('../../custom-elements.js').Page} T
     * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
     * @param {T} page
     * @param {Partial<Pick<U, import('../../services/extensions/url.extension.js').NonMethodKeys<U>>>} params
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
     * @template {import('../../custom-elements.js').Page} T
     * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
     * @param {T} page
     * @param {Partial<Pick<U, import('../../services/extensions/url.extension.js').NonMethodKeys<U>>>} params
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
        /** @type {import('../../custom-elements.js').Page} */ this.page = null;
        /** @type {Object.<string, any>} */ this.params = null;
        this.disabled = false;
    }

    render() {
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
