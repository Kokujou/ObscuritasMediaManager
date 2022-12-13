import { Pages } from '../../custom-elements.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { LoadingScreen } from '../../native-components/loading-screen/loading-screen.js';
import { changePage, getPageName } from '../../services/extensions/url.extension.js';
import { WelcomePage } from '../welcome-page/welcome-page.js';
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

    static defaultFragment = getPageName(WelcomePage);

    get content() {
        var content = Pages[session.currentPage.current()];
        return content;
    }

    get currentPage() {
        return location.hash.length > 1 ? location.hash.substr(1) : getPageName(WelcomePage);
    }

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];

        PageRouting.instance = this;

        window.addEventListener('hashchange', () => {
            this.loadPageFromHash(null);
        });

        window.onpopstate = (e) => {
            session.currentPage.next(this.currentPage);
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
        session.currentPage.next(this.currentPage);
        document.querySelector(LoadingScreen.tag).remove();
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

    async switchPage(newValue, oldValue) {
        // @ts-ignore
        if (!this.classList.replace(`current-page-${oldValue}`, `current-page-${newValue}`))
            this.classList.add(`current-page-${newValue}`);

        if (Object.keys(Pages).includes(session.currentPage.current())) {
            this.changeHash(newValue);
            return;
        }

        changePage(PageRouting.defaultFragment);
    }

    loadPageFromHash(e) {
        e?.preventDefault();
        var nextPage = this.currentPage;
        if (session.currentPage.current() != nextPage) changePage(nextPage);
    }

    render() {
        return renderPageRouting(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        PageRouting.instance = null;
    }
}
