import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';
import { changePage } from '../../services/extensions/url.extension.js';
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
                            @click="${() => changePage(Pages.animeGerDub.routes[0])}"
                            caption="Animes (Dub)"
                            src="../../resources/images/ger-dub2.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => changePage(Pages.animeGerSub.routes[0])}"
                            caption="Animes (Sub)"
                            src="../../resources/images/ger-sub4.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => changePage(Pages.animeMovies.routes[0])}"
                            caption="Animefilme"
                            src="../../resources/images/totoro.png"
                        ></image-tile>
                    </div>
                    <div class="tile-link-section">
                        <image-tile
                            @click="${() => changePage(Pages.realSeries.routes[0])}"
                            caption="Realfilmserien"
                            src="../../resources/images/real-series.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => changePage(Pages.realMovies.routes[0])}"
                            caption="Realfilme"
                            src="../../resources/images/real-movies.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => changePage(Pages.jDrama.routes[0])}"
                            caption="J-Dramen"
                            src="../../resources/images/j-drama.png"
                        ></image-tile>
                    </div>
                    <div class="tile-link-section">
                        <image-tile
                            @click="${() => changePage(Pages.music.routes[0])}"
                            caption="Musik"
                            src="../../resources/images/music.png"
                        ></image-tile>
                        <image-tile
                            @click="${() => changePage(Pages.games.routes[0])}"
                            caption="Games"
                            src="../../resources/images/games.png"
                        ></image-tile>
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
