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
            page: { type: Object, reflect: true },
            params: { type: Object, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    /**
     * @template {import('../../custom-elements.js').Page} T
     * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
     * @param {T} page
     * @param {Partial<Pick<U, import('../../services/extensions/url.extension.js').NonMethodKeys<U>>>} params
     * @param {TemplateResult} inner
     * @param {boolean} [disabled]
     */
    static forPage(page, params, inner, disabled, id = '') {
        return html`<link-element id="${id}" .page="${page}" .params="${params}" ?disabled="${disabled}">${inner}</link-element>`;
    }

    get fullLink() {
        if (this.href) return this.href;
        var link = this.href ?? '';
        if (this.params)
            link += `?${Object.entries(this.params)
                .map((x) => `${x[0]}=${x[1]}`)
                .join('&')}`;
        if (this.page) link += `#${getPageName(this.page)}`;
        return link;
    }

    constructor() {
        super();

        this.href = null;
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
        if (this.disabled) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.returnValue = false;
            event.preventDefault();
            return;
        }

        event.stopPropagation();
        event.stopImmediatePropagation();
        event.returnValue = false;
        event.preventDefault();

        if (this.href) location.assign(this.fullLink);
        else changePage(this.page, this.params);

        return false;
    }
}
