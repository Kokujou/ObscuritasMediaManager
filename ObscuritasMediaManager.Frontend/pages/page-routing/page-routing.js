import { Subscription } from '../../data/observable.js';
import { RouteDefinition } from '../../data/pages.js';
import { session } from '../../data/session.js';
import { html, LitElement } from '../../exports.js';
import { changePage, getQueryValue } from '../../services/extensions/url.extension.js';
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

    changeHash(newHash) {
        var searchString = location.search.substring(1);
        var searchQueries = searchString.split('&');
        searchQueries = searchQueries.filter((x) => this.currentRoute.withQueries.includes(x.split('=')[0]));
        if (searchQueries.length > 0) searchString = `?${searchQueries.join('&')}`;
        else searchString = '';

        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + searchString + `#${newHash}`;
        window.history.replaceState({ path: newurl }, '', newurl);
    }

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];

        /** @type {{[key: string]: RouteDefinition}} */ this.routes = {};
        this.defaultFragment = '';

        window.addEventListener('hashchange', () => {
            this.loadPageFromHash(null);
        });

        window.onpopstate = (e) => {
            session.currentPage.next(location.hash.length > 1 ? location.hash.substr(1) : 'empty');
        };

        window.addEventListener('resize', () => this.requestUpdate(undefined));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                document.execCommand('insertLineBreak');
                event.preventDefault();
            }
        });
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(
            session.currentPage.subscribe((newValue, oldValue) => {
                if (newValue) this.switchPage(newValue, oldValue).then(() => this.requestUpdate(undefined));
            })
        );
    }

    get currentRoute() {
        var matches = Object.values(this.routes)
            .filter(
                (route) => route.routes.includes(session.currentPage.current()) && route.withQueries.every((query) => getQueryValue(query))
            )
            .sort((a, b) => b.withQueries.length - a.withQueries.length);

        return matches[0];
    }

    get content() {
        return this.currentRoute.component;
    }

    get fragments() {
        return Object.values(this.routes).map((x) => x.routes);
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        session.currentPage.next(location.hash.length > 1 ? location.hash.substr(1) : 'empty');
    }

    async switchPage(newValue, oldValue) {
        // @ts-ignore
        if (!this.classList.replace(`current-page-${oldValue}`, `current-page-${newValue}`)) this.classList.add(`current-page-${newValue}`);

        if (this.currentRoute) {
            this.changeHash(newValue);
            return;
        }

        if (this.defaultFragment) changePage(this.defaultFragment);
    }

    loadPageFromHash(e) {
        e?.preventDefault();
        var nextPage = location.hash.length > 1 ? location.hash.substr(1) : 'empty';
        if (session.currentPage.current() != nextPage) changePage(nextPage);
    }

    render() {
        if (!this.currentRoute) return html`<div class="current-page"><slot></slot></div>`;
        return html`<div class="current-page">${this.content ? html([this.content]) : html`<slot></slot>`}</div>`;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}
