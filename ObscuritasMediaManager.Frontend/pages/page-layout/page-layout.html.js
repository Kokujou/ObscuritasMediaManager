import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';

export function renderWebcomponentTemplate() {
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
                        <a href="#${Pages.welcome.route}" class="nav-item home-link"> Start </a>
                    </div>
                </div>
                <div class="nav-section">
                    <div class="nav-section-heading">Anime</div>

                    <div class="nav-section-links">
                        ${renderNavItem(Pages.animeGerDub.route, 'Animes (Ger Dub)')}<br />
                        ${renderNavItem(Pages.animeGerSub.route, 'Animes (Ger Sub)')} <br />
                        ${renderNavItem(Pages.animeMovies.route, 'Animefilme')}<br />
                    </div>
                </div>
                <div class="nav-section">
                    <div class="nav-section-heading">Realfilm</div>

                    <div class="nav-section-links">
                        ${renderNavItem(Pages.realSeries.route, 'Realfilmserien')}<br />
                        ${renderNavItem(Pages.realMovies.route, 'Realfilme')}<br />
                        ${renderNavItem(Pages.jDrama.route, 'J-Drama')}<br />
                    </div>
                </div>
                <div class="nav-section">
                    <div class="nav-section-heading">Anderes</div>

                    <div class="nav-section-links">
                        ${renderNavItem(Pages.music.route, 'Musik')}<br />
                        ${renderNavItem(Pages.games.route, 'Games')}<br />
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function renderNavItem(target, text) {
    return html`<a href="#${target}" class="nav-item"> ${text} </a>`;
}
