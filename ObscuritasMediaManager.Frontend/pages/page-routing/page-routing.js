import { Pages } from '../../custom-elements.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { LoadingScreen } from '../../native-components/loading-screen/loading-screen.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
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

    static get container() {
        if (!PageRouting.instance?.shadowRoot) return null;
        return PageRouting.instance.shadowRoot.querySelector('#current-page');
    }

    get currentPage() {
        return Pages.find((x) => x.hash == location.hash.substr(1)) ?? Pages.find((x) => x.hash == getPageName(WelcomePage));
    }

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];

        PageRouting.instance = this;

        window.addEventListener('hashchange', () => {
            this.loadPageFromHash(null);
        });

        window.onpopstate = (e) => {
            session.currentPage.next(this.currentPage.hash);
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
        session.currentPage.next(this.currentPage.hash);
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

    /**
     * @param {string} newValue
     * @param {string} oldValue
     */
    async switchPage(newValue, oldValue) {
        // @ts-ignore
        if (!this.classList.replace(`current-page-${oldValue}`, `current-page-${newValue}`))
            this.classList.add(`current-page-${newValue}`);

        if (Pages.some((x) => x.hash == session.currentPage.current())) {
            this.changeHash(newValue);
            return;
        }

        changePage(PageRouting.defaultFragment);
    }

    loadPageFromHash(e) {
        e?.preventDefault();
        var nextPage = this.currentPage;
        if (session.currentPage.current() != nextPage.hash) changePage(nextPage.hash);
    }

    render() {
        if (this.currentPage.element.pageName) document.title = this.currentPage.element.pageName;
        if (this.currentPage.element.icon) setFavicon(this.currentPage.element.icon);
        return renderPageRouting(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        PageRouting.instance = null;
    }
}
