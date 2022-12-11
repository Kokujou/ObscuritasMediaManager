import { LitElementBase } from '../../data/lit-element-base.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { renderLinkElementStyles } from './link-element.css.js';
import { renderLinkElement } from './link-element.html.js';

export class LinkElement extends LitElementBase {
    static get styles() {
        return renderLinkElementStyles();
    }

    static get properties() {
        return {
            href: { type: String, reflect: true },
            hash: { type: String, reflect: true },
            search: { type: String, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    get fullLink() {
        var link = this.href;
        if (this.search) link += `?${this.search}`;
        if (this.hash) link += `#${this.hash}`;
        return link;
    }

    constructor() {
        super();

        this.href = '';
        this.hash = '';
        this.search = '';
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
        if (!this.hash || this.hash.length <= 0) return;
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.returnValue = false;
        event.preventDefault();

        changePage(this.hash, `?${this.search}`);

        return false;
    }
}
