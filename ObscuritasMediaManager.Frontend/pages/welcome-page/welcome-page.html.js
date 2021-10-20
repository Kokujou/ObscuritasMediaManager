import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';

export function renderWelcomePage() {
    return html`
        <page-layout>
            <div id="welcome-page">
                <div id="tile-link-area">
                    <div id="tile-link-section">
                        <link-element .hash="${Pages.animeGerDub.routes[0]}">
                            <image-tile caption="Animes (Dub)" src="../../resources/images/ger-dub2.png"></image-tile
                        ></link-element>
                        <link-element .hash="${Pages.animeGerSub.routes[0]}"
                            ><image-tile caption="Animes (Sub)" src="../../resources/images/ger-sub4.png"></image-tile
                        ></link-element>
                        <link-element .hash="${Pages.animeMovies.routes[0]}"
                            ><image-tile caption="Animefilme" src="../../resources/images/totoro.png"></image-tile
                        ></link-element>
                    </div>
                    <div id="tile-link-section">
                        <link-element .hash="${Pages.realSeries.routes[0]}"
                            ><image-tile caption="Realfilmserien" src="../../resources/images/real-series.png"></image-tile
                        ></link-element>
                        <link-element .hash="${Pages.realMovies.routes[0]}"
                            ><image-tile caption="Realfilme" src="../../resources/images/real-movies.png"></image-tile
                        ></link-element>
                        <link-element .hash="${Pages.jDrama.routes[0]}"
                            ><image-tile caption="J-Dramen" src="../../resources/images/j-drama.png"></image-tile
                        ></link-element>
                    </div>
                    <div id="tile-link-section">
                        <link-element .hash="${Pages.music.routes[0]}"
                            ><image-tile caption="Musik" src="../../resources/images/music.png"></image-tile
                        ></link-element>
                        <link-element .hash="${Pages.games.routes[0]}"
                            ><image-tile caption="Games" src="../../resources/images/games.png"></image-tile
                        ></link-element>
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
