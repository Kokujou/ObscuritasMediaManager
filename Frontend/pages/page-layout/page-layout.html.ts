import { html } from 'lit-element';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { LinkElement } from '../../native-components/link-element/link-element';
import { getPageName } from '../../services/extensions/url.extension';
import { MediaPage } from '../media-page/media-page';
import { MusicPage } from '../music-page/music-page';
import { RecipesPage } from '../recipes-page/recipes-page';
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
                            class: getPageName(WelcomePage) == Session.currentPage.current() ? 'active' : 'normal',
                        })}
                    </div>
                </div>
                <div id="nav-section">
                    <div class="nav-section-heading">Zeugs</div>

                    <div id="nav-section-links">
                        ${renderNavItem(MediaPage)}<br />
                        ${renderNavItem(MusicPage)}<br />
                        ${renderNavItem(RecipesPage)}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * @template {typeof LitElementBase & {isPage: boolean, pageName: string}} T
 * @param {T} element
 */
function renderNavItem(element) {
    var active = Session.currentPage.current() == getPageName(element);
    return LinkElement.forPage(element, null, html`${element.pageName}`, { class: active ? 'active' : 'normal' });
}
