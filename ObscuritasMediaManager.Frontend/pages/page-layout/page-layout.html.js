import { LitElementBase } from '../../data/lit-element-base.js';
import { html } from '../../exports.js';
import { getPageName } from '../../services/extensions/url.extension.js';
import { MediaPage } from '../media-page/media-page.js';
import { MusicPage } from '../music-page/music-page.js';
import { RecipesPage } from '../recipes-page/recipes-page.js';
import { WelcomePage } from '../welcome-page/welcome-page.js';

export function renderPageLayout() {
    return html`${renderHeader()}<br />
        ${renderNavigation()}<br />
        <div id="layout-content"><slot></slot></div>`;
}

function renderHeader() {
    return html`<div id="header">
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
                    <div id="nav-section-links">
                        <link-element .hash="${getPageName(WelcomePage)}" id="home-link" class="nav-item">Start</link-element>
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Zeugs</div>

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
    return html`<link-element .hash="${getPageName(element)}" class="nav-item"> ${element.pageName} </link-element>`;
}
