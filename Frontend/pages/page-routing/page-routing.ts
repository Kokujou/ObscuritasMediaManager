import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { Page } from '../../data/util-types';
import { setFavicon } from '../../extensions/style.extensions';
import { changePage, getPageName, queryToObject } from '../../extensions/url.extension';
import { ClientInteropService } from '../../services/client-interop-service';
import { LoginPage, LoginPage } from '../login-page/login-page';
import { MaintenancePage } from '../maintenance-page/maintenance-page';
import { WelcomePage } from '../welcome-page/welcome-page';
import { renderPageRoutingStyles } from './page-routing.css';
import { renderPageRouting } from './page-routing.html';

@customElement('page-routing')
export class PageRouting extends LitElementBase {
    static override get styles() {
        return renderPageRoutingStyles();
    }

    static get container() {
        if (!PageRouting.instance?.shadowRoot) return null;
        return PageRouting.instance.shadowRoot!.querySelector('#current-page');
    }

    get currentPage() {
        return (window.customElements.get(location.hash.substr(1) + '-page') as Page) ?? WelcomePage;
    }

    static currentPageInstance: LitElementBase | null = null;

    static instance: PageRouting;

    constructor() {
        super();
        PageRouting.instance = this;

        window.addEventListener('hashchange', () => {
            this.loadPageFromHash(null);
        });

        window.onpopstate = (e: Event) => {
            Session.currentPage.next(getPageName(this.currentPage));
        };
        window.addEventListener('resize', () => this.requestFullUpdate());
        var self = this;
        window.addEventListener('orientationchanged', function () {
            self.requestFullUpdate();
        });
    }

    override connectedCallback() {
        super.connectedCallback();

        ClientInteropService.startConnection();
        document.addEventListener('login', () => changePage(LoginPage));
        document.addEventListener('maintenance', () => changePage(MaintenancePage));
        this.subscriptions.push(
            Session.currentPage.subscribe(async (newValue, oldValue) => {
                if (newValue) await this.switchPage(newValue, oldValue).then(() => this.requestFullUpdate());
            })
        );
    }

    async firstUpdated(_changedProperties: Map<any, any>) {
        super.firstUpdated(_changedProperties);
        Session.currentPage.next(getPageName(this.currentPage));
        document.querySelector('loading-screen')?.remove();
    }

    changeHash(newHash: string) {
        var newurl =
            window.location.protocol + '//' + window.location.host + window.location.pathname + location.search + `#${newHash}`;
        window.history.replaceState({ path: newurl }, '', newurl);
    }

    async switchPage(newValue: string, oldValue: string) {
        // @ts-ignore
        if (!this.classList.replace(`current-page-${oldValue}`, `current-page-${newValue}`))
            this.classList.add(`current-page-${newValue}`);

        var newPage = window.customElements.get(newValue + '-page');
        if (newPage) {
            var pageName = () => PageRouting.currentPageInstance?.tagName.replace('-PAGE', '');
            var isNewPageLoad = !PageRouting.currentPageInstance || newValue.toLowerCase() != pageName()?.toLowerCase();
            if (isNewPageLoad) {
                PageRouting.container!.querySelectorAll(':not(slot)').forEach((x) => x.remove());
                PageRouting.currentPageInstance = new newPage() as LitElementBase;
            }

            if (!PageRouting.currentPageInstance) return;

            this.changeHash(newValue);
            var params = queryToObject();
            for (var pair of Object.entries(params)) {
                try {
                    //@ts-ignore
                    PageRouting.currentPageInstance[pair[0]] = JSON.parse(pair[1]);
                } catch {
                    //@ts-ignore
                    PageRouting.currentPageInstance[pair[0]] = pair[1];
                }
            }
            if (isNewPageLoad) PageRouting.container!.appendChild(PageRouting.currentPageInstance!);
            await PageRouting.currentPageInstance.requestFullUpdate();
            await PageRouting.currentPageInstance.updateComplete;
            return;
        }

        changePage(WelcomePage);
    }

    loadPageFromHash(e: Event | null) {
        e?.preventDefault();
        var nextPage = this.currentPage;
        var params = queryToObject();
        if (Session.currentPage.current() != getPageName(nextPage)) changePage(nextPage, params);
    }

    override render() {
        if (this.currentPage.icon) setFavicon(this.currentPage.icon);
        return renderPageRouting.call(this);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        PageRouting.instance = null!;
    }
}
