import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';
import { WelcomePage } from './welcome-page.js';

/**
 * @param {WelcomePage} welcomePage
 */
export function renderWelcomePage(welcomePage) {
    return html`
        <page-layout>
            <div class="welcome-page">
                <div class="page-heading">Willkommen!</div>
                <div class="greeting">
                    Willkommen auf der Obscuritas Media Management Plattform. <br />
                    Dies ist eine Seite zur Verwaltung, Kategorisierung und Visualisierung privater Mediensammlungen.
                    <br />
                    Womit wollen Sie heute beginnen?
                </div>

                <div class="tile-link-area">
                    <div class="tile-link-section">
                        <image-tile
                            @click="${() => (document.location.hash = Pages.animeGerDub.route)}"
                            caption="Animes (Dub)"
                            src="../../resources/images/ger-dub2.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => (document.location.hash = Pages.animeGerSub.route)}"
                            caption="Animes (Sub)"
                            src="../../resources/images/ger-sub4.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => (document.location.hash = Pages.animeMovies.route)}"
                            caption="Animefilme"
                            src="../../resources/images/totoro.png"
                        ></image-tile>
                    </div>
                    <div class="tile-link-section">
                        <image-tile
                            @click="${() => (document.location.hash = Pages.realSeries.route)}"
                            caption="Realfilmserien"
                            src="../../resources/images/real-series.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => (document.location.hash = Pages.realMovies.route)}"
                            caption="Realfilme"
                            src="../../resources/images/real-movies.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => (document.location.hash = Pages.jDrama.route)}"
                            caption="J-Dramen"
                            src="../../resources/images/j-drama.png"
                        ></image-tile>
                    </div>
                    <div class="tile-link-section">
                        <image-tile
                            @click="${() => (document.location.hash = Pages.music.route)}"
                            caption="Musik"
                            src="../../resources/images/music.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => (document.location.hash = Pages.games.route)}"
                            caption="Games"
                            src="../../resources/images/games.png"
                        ></image-tile>
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
