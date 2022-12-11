import { html } from '../../exports.js';
import { getPageName } from '../../services/extensions/url.extension.js';
import { AnimeGerDubPage } from '../anime-ger-dub-page/anime-ger-dub-page.js';
import { AnimeGerSubPage } from '../anime-ger-sub-page/anime-ger-sub-page.js';
import { AnimeMoviesPage } from '../anime-movies-page/anime-movies-page.js';
import { JDramaPage } from '../jdrama-page/jdrama-page.js';
import { MusicPage } from '../music-page/music-page.js';
import { RealMoviesPage } from '../real-movies-page/real-movies-page.js';
import { RealSeriesPage } from '../real-series-page/real-series-page.js';
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
                        <link-element .hash="${getPageName(WelcomePage)}" id="home-link" class="nav-item"> Start </link-element>
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Anime</div>

                    <div id="nav-section-links">
                        ${renderNavItem(getPageName(AnimeGerDubPage), 'Animes (Ger Dub)')}<br />
                        ${renderNavItem(getPageName(AnimeGerSubPage), 'Animes (Ger Sub)')} <br />
                        ${renderNavItem(getPageName(AnimeMoviesPage), 'Animefilme')}<br />
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Realfilm</div>

                    <div id="nav-section-links">
                        ${renderNavItem(getPageName(RealSeriesPage), 'Realfilmserien')}<br />
                        ${renderNavItem(getPageName(RealMoviesPage), 'Realfilme')}<br />
                        ${renderNavItem(getPageName(JDramaPage), 'J-Drama')}<br />
                    </div>
                </div>
                <div id="nav-section">
                    <div id="nav-section-heading">Anderes</div>
                    <div id="nav-section-links">
                        ${renderNavItem(getPageName(MusicPage), 'Musik')}<br />
                        ${renderNavItem(getPageName(RecipesPage), 'Rezepte')}
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
