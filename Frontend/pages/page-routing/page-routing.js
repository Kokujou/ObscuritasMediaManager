import { Pages } from '../../custom-elements.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Subscription } from '../../data/observable.js';
import { Session } from '../../data/session.js';
import { LoadingScreen } from '../../native-components/loading-screen/loading-screen.js';
import { setFavicon } from '../../services/extensions/style.extensions.js';
import { changePage, getPageName, queryToObject } from '../../services/extensions/url.extension.js';
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

    static defaultPage = WelcomePage;

    static get container() {
        if (!PageRouting.instance?.shadowRoot) return null;
        return PageRouting.instance.shadowRoot.querySelector('#current-page');
    }

    get currentPage() {
        return (
            Pages.find((x) => getPageName(x) == location.hash.substr(1)) ??
            Pages.find((x) => getPageName(x) == getPageName(WelcomePage))
        );
    }

    /** @type {LitElementBase} */ static currentPageInstance = null;

    constructor() {
        super();

        /** @type {Subscription[]} */ this.subscriptions = [];

        PageRouting.instance = this;

        window.addEventListener('hashchange', () => {
            this.loadPageFromHash(null);
        });

        window.onpopstate = (e) => {
            Session.currentPage.next(getPageName(this.currentPage));
        };
        window.addEventListener('resize', () => this.requestFullUpdate());
        var self = this;
        window.addEventListener('orientationchanged', function () {
            self.requestFullUpdate();
        });
    }

    connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(
            Session.currentPage.subscribe((newValue, oldValue) => {
                if (newValue) this.switchPage(newValue, oldValue).then(() => this.requestFullUpdate());
            })
        );
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        Session.currentPage.next(getPageName(this.currentPage));
        document.querySelector(LoadingScreen.tag).remove();
    }

    /** @type {PageRouting} */ static instance;

    changeHash(newHash) {
        var newurl =
            window.location.protocol + '//' + window.location.host + window.location.pathname + location.search + `#${newHash}`;
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

        if (Pages.some((x) => getPageName(x) == newValue)) {
            var pageName = () => PageRouting.currentPageInstance.tagName.replace('-PAGE', '');
            var isNewPageLoad = !PageRouting.currentPageInstance || newValue.toLowerCase() != pageName().toLowerCase();
            if (isNewPageLoad) {
                PageRouting.container.querySelectorAll(':not(slot)').forEach((x) => x.remove());
                var newPage = Pages.find((x) => newValue == getPageName(x));
                PageRouting.currentPageInstance = new newPage();
            }

            this.changeHash(newValue);
            var params = queryToObject();
            for (var pair of Object.entries(params)) {
                try {
                    PageRouting.currentPageInstance[pair[0]] = JSON.parse(pair[1]);
                } catch {
                    PageRouting.currentPageInstance[pair[0]] = pair[1];
                }
            }
            if (isNewPageLoad) PageRouting.container.appendChild(PageRouting.currentPageInstance);
            await PageRouting.currentPageInstance.requestFullUpdate();
            return;
        }

        changePage(PageRouting.defaultPage);
    }

    loadPageFromHash(e) {
        e?.preventDefault();
        var nextPage = this.currentPage;
        var params = queryToObject();
        if (Session.currentPage.current() != getPageName(nextPage)) changePage(nextPage, params);
    }

    render() {
        if (this.currentPage['icon']) setFavicon(this.currentPage['icon']);
        return renderPageRouting(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        PageRouting.instance = null;
    }
}
