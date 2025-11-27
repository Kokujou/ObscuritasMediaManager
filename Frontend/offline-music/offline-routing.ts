import { html } from 'lit';
import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../data/lit-element-base';
import { Session } from '../data/session';
import { Page } from '../data/util-types';
import { changePage, getPageName, queryToObject } from '../extensions/url.extension';
import { OfflineMusicPage } from './offline-music-page/offline-music-page';
import { OfflineSession } from './session';

@customElement('offline-routing')
export class OfflineRouting extends LitElementBase {
    static readonly DefaultPage = OfflineMusicPage;

    @state() private declare currentPageInstance: LitElementBase | null;

    get currentPage() {
        return (window.customElements.get(location.hash.substr(1) + '-page') as Page) ?? OfflineRouting.DefaultPage;
    }

    async connectedCallback() {
        super.connectedCallback();

        document.addEventListener('login', () => location.assign('../#login'));
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

        this.subscriptions.push(
            Session.currentPage.subscribe(async (newValue) => {
                if (newValue) await this.switchPage(newValue).then(() => this.requestFullUpdate());
            })
        );

        await OfflineSession.initialize();
        Session.currentPage.next(getPageName(this.currentPage));
        this.requestFullUpdate();
    }

    protected override render() {
        return html` ${this.currentPageInstance ?? html`<slot></slot>`} `;
    }

    changeHash(newHash: string) {
        var newurl =
            window.location.protocol + '//' + window.location.host + window.location.pathname + location.search + `#${newHash}`;
        window.history.replaceState({ path: newurl }, '', newurl);
    }

    async switchPage(newValue: string) {
        var newPage = window.customElements.get(newValue + '-page') as Page;
        if (newPage) {
            var pageName = () => this.currentPageInstance?.tagName.replace('-PAGE', '');
            var isNewPageLoad = !this.currentPageInstance || newValue.toLowerCase() != pageName()?.toLowerCase();
            if (isNewPageLoad) this.currentPageInstance = new newPage() as LitElementBase;

            if (!this.currentPageInstance) return;

            this.changeHash(newValue);
            var params = queryToObject();
            for (var pair of Object.entries(params)) {
                try {
                    this.currentPageInstance[pair[0] as never] = JSON.parse(pair[1]) as never;
                } catch {
                    this.currentPageInstance[pair[0] as never] = pair[1] as never;
                }
            }
            await this.currentPageInstance.requestFullUpdate();
            await this.currentPageInstance.updateComplete;
            return;
        }

        changePage(OfflineRouting.DefaultPage);
    }

    loadPageFromHash(e: Event | null) {
        e?.preventDefault();
        var nextPage = this.currentPage;
        var params = queryToObject();
        if (Session.currentPage.current() != getPageName(nextPage)) changePage(nextPage, params);
    }
}
