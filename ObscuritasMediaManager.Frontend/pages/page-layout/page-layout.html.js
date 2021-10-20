import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';

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
                        <link-element .hash="${Pages.welcome.routes[0]}" id="home-link" class="nav-item"> Start </link-element>
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Anime</div>

                    <div id="nav-section-links">
                        ${renderNavItem(Pages.animeGerDub.routes[0], 'Animes (Ger Dub)')}<br />
                        ${renderNavItem(Pages.animeGerSub.routes[0], 'Animes (Ger Sub)')} <br />
                        ${renderNavItem(Pages.animeMovies.routes[0], 'Animefilme')}<br />
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Realfilm</div>

                    <div id="nav-section-links">
                        ${renderNavItem(Pages.realSeries.routes[0], 'Realfilmserien')}<br />
                        ${renderNavItem(Pages.realMovies.routes[0], 'Realfilme')}<br />
                        ${renderNavItem(Pages.jDrama.routes[0], 'J-Drama')}<br />
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Anderes</div>

                    <div id="nav-section-links">
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
 */
function renderNavItem(target, text) {
    return html`<link-element .hash="${target}" class="nav-item"> ${text} </link-element>`;
}
