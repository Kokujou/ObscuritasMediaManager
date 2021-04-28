import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';
import { changePage } from '../../services/extensions/url.extension.js';

export function renderPageLayout() {
    return html`${renderHeader()}<br />
        ${renderNavigation()}<br />
        <div class="layout-content"><slot></slot></div>`;
}

function renderHeader() {
    return html`<div class="header">
        <div class="logo-container">
            <a class="logo" href="#welcome">
                <div class="title">Obscuritas Media Management</div>
                <div class="subtitle">オブスキュリタス メディア マネジメント</div>
            </a>
        </div>
    </div>`;
}

function renderNavigation() {
    return html`<div class="navigation-container">
        <div class="navigation">
            <div class="link-area">
                <div class="nav-section">
                    <div class="nav-section-links">
                        <a href="javascript:void(0)" @click="${() => changePage(Pages.welcome.routes[0])}" class="nav-item home-link">
                            Start
                        </a>
                    </div>
                </div>
                <div class="nav-section">
                    <div class="nav-section-heading">Anime</div>

                    <div class="nav-section-links">
                        ${renderNavItem(Pages.animeGerDub.routes[0], 'Animes (Ger Dub)')}<br />
                        ${renderNavItem(Pages.animeGerSub.routes[0], 'Animes (Ger Sub)')} <br />
                        ${renderNavItem(Pages.animeMovies.routes[0], 'Animefilme')}<br />
                    </div>
                </div>
                <div class="nav-section">
                    <div class="nav-section-heading">Realfilm</div>

                    <div class="nav-section-links">
                        ${renderNavItem(Pages.realSeries.routes[0], 'Realfilmserien')}<br />
                        ${renderNavItem(Pages.realMovies.routes[0], 'Realfilme')}<br />
                        ${renderNavItem(Pages.jDrama.routes[0], 'J-Drama')}<br />
                    </div>
                </div>
                <div class="nav-section">
                    <div class="nav-section-heading">Anderes</div>

                    <div class="nav-section-links">
                        ${renderNavItem(Pages.music.routes[0], 'Musik')}<br />
                        ${renderNavItem(Pages.games.routes[0], 'Games')}<br />
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * @param {string} target
 * @param {string} text
 * @param {undefined} pageLayout
 */
function renderNavItem(target, text, pageLayout) {
    return html`<a href="javascript:void(0)" @click="${() => changePage(target)}" class="nav-item"> ${text} </a>`;
}
