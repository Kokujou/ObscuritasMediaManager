import { html } from 'lit-element';
import { Session } from '../../data/session';
import { Page } from '../../data/util-types';
import { getPageName } from '../../extensions/url.extension';
import { LinkElement } from '../../native-components/link-element/link-element';
import { MediaPage } from '../media-page/media-page';
import { MusicPage } from '../music-page/music-page';
import { RecipesPage } from '../recipes-page/recipes-page';
import { ShoppingPage } from '../shopping-page/shopping-page';
import { WelcomePage } from '../welcome-page/welcome-page';

export function renderPageLayout() {
    return html` <div id="page-layout">
        ${renderHeader()}<br />
        ${renderNavigation()}<br />
        <div id="layout-content"><slot></slot></div>
    </div>`;
}

function renderHeader() {
    return html` <div id="header">
        <div id="logo-container">
            <a id="logo" href="#welcome">
                <div id="title">Obscuritas Media Management</div>
                <div id="subtitle">オブスキュリタス メディア マネジメント</div>
            </a>
        </div>
    </div>`;
}

function renderNavigation() {
    return html`<div id="navigation-container">
        <div id="navigation">
            <div id="link-area">
                <div id="nav-section">
                    <div class="nav-section-links">
                        ${LinkElement.forPage(WelcomePage, null, html`Start`, {
                            className: getPageName(WelcomePage) == Session.currentPage.current() ? 'active' : 'normal',
                        })}
                    </div>
                </div>
                <div id="nav-section">
                    <div class="nav-section-heading">Zeugs</div>

                    <div id="nav-section-links">
                        ${renderNavItem(MediaPage)}<br />
                        ${renderNavItem(MusicPage)}<br />
                        ${renderNavItem(RecipesPage)}<br />
                        ${renderNavItem(ShoppingPage)}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderNavItem<T extends Page>(element: T) {
    var active = Session.currentPage.current() == getPageName(element);
    return LinkElement.forPage(element, null, html`${element.pageName}`, { className: active ? 'active' : 'normal' });
}
