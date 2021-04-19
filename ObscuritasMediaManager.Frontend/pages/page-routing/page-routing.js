import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { html, LitElement } from '../../exports.js';
import { renderPageRoutingStyles } from './page-routing.css.js';

export class PageRouting extends LitElement {
    static get styles() {
        return renderPageRoutingStyles();
    }

    static get properties() {
        return {
            routes: { type: Object, reflect: true },
            defaultFragment: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];

        this.routes = {};
        this.defaultFragment = '';

        window.addEventListener('hashchange', () => {
            if (location.hash.length <= 1) return;
            var newHash = location.hash.substring(1);
            if (newHash != session.currentPage.current()) session.currentPage.next(newHash);
        });
        window.addEventListener('resize', () => this.requestUpdate(undefined));
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(
            session.currentPage.subscribe((newValue, oldValue) => {
                if (newValue) this.switchPage(newValue, oldValue).then(() => this.requestUpdate(undefined));
            })
        );
    }

    get content() {
        return this.routes[session.currentPage.current()];
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        this.loadPageFromHash(null);
    }

    async switchPage(newValue, oldValue) {
        // @ts-ignore
        if (!this.classList.replace(`current-page-${oldValue}`, `current-page-${newValue}`)) this.classList.add(`current-page-${newValue}`);

        if (Object.keys(this.routes).some((x) => x == newValue)) {
            window.location.search = '';
            window.location.hash = `#${newValue}`;
            return;
        }

        if (this.defaultFragment) session.currentPage.next(this.defaultFragment);
    }

    loadPageFromHash(e) {
        e?.preventDefault();
        var nextPage = location.hash.length > 1 ? location.hash.substr(1) : 'empty';
        if (session.currentPage.current() != nextPage) session.currentPage.next(nextPage);
    }

    render() {
        return html`<div class="current-page">${this.content ? html([this.content]) : html`<slot></slot>`}</div>`;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}
