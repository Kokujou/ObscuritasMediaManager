import { Pages } from '../../custom-elements.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { LoadingScreen } from '../../native-components/loading-screen/loading-screen.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { renderPageRoutingStyles } from './page-routing.css.js';
import { renderPageRouting } from './page-routing.html.js';

export class PageRouting extends LitElementBase {
    static get styles() {
        return renderPageRoutingStyles();
    }

    static get properties() {
        return {
            defaultFragment: { type: String, reflect: true },
        };
    }

    /** @type {PageRouting} */ static instance;

    changeHash(newHash) {
        var searchString = location.search.substring(1);
        var searchQueries = searchString.split('&');
        if (searchQueries.length > 0) searchString = `?${searchQueries.join('&')}`;
        else searchString = '';

        var newurl =
            window.location.protocol + '//' + window.location.host + window.location.pathname + searchString + `#${newHash}`;
        window.history.replaceState({ path: newurl }, '', newurl);
    }

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];

        this.defaultFragment = '';
        PageRouting.instance = this;

        window.addEventListener('hashchange', () => {
            this.loadPageFromHash(null);
        });

        window.onpopstate = (e) => {
            session.currentPage.next(location.hash.length > 1 ? location.hash.substr(1) : 'empty');
        };
        window.addEventListener('resize', () => this.requestUpdate(undefined));
        var self = this;
        window.addEventListener('orientationchanged', function () {
            self.requestUpdate(undefined);
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

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        session.currentPage.next(location.hash.length > 1 ? location.hash.substr(1) : 'empty');
        document.querySelector(LoadingScreen.tag).remove();
    }

    get content() {
        var content = Pages[session.currentPage.current()];
        return content;
    }

    get fragments() {
        return Object.values(Pages);
    }

    async switchPage(newValue, oldValue) {
        // @ts-ignore
        if (!this.classList.replace(`current-page-${oldValue}`, `current-page-${newValue}`))
            this.classList.add(`current-page-${newValue}`);

        if (session.currentPage.current()) {
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
        return renderPageRouting(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
        PageRouting.instance = null;
    }
}
