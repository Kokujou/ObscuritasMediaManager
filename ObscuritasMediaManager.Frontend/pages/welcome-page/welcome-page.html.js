import { html } from '../../exports.js';
import { getPageName } from '../../services/extensions/url.extension.js';
import { AnimeGerDubPage } from '../anime-ger-dub-page/anime-ger-dub-page.js';
import { AnimeGerSubPage } from '../anime-ger-sub-page/anime-ger-sub-page.js';
import { AnimeMoviesPage } from '../anime-movies-page/anime-movies-page.js';
import { JDramaPage } from '../jdrama-page/jdrama-page.js';
import { MusicPage } from '../music-page/music-page.js';
import { RealMoviesPage } from '../real-movies-page/real-movies-page.js';
import { RealSeriesPage } from '../real-series-page/real-series-page.js';

export function renderWelcomePage() {
    return html`
        <page-layout>
            <div id="welcome-page">
                <div id="tile-link-area">
                    <div id="tile-link-section">
                        <link-element .hash="${getPageName(AnimeGerDubPage)}">
                            <image-tile caption="Animes (Dub)" src="../../resources/images/ger-dub2.png"></image-tile
                        ></link-element>
                        <link-element .hash="${getPageName(AnimeGerSubPage)}"
                            ><image-tile caption="Animes (Sub)" src="../../resources/images/ger-sub4.png"></image-tile
                        ></link-element>
                        <link-element .hash="${getPageName(AnimeMoviesPage)}"
                            ><image-tile caption="Animefilme" src="../../resources/images/totoro.png"></image-tile
                        ></link-element>
                    </div>
                    <div id="tile-link-section">
                        <link-element .hash="${getPageName(RealSeriesPage)}"
                            ><image-tile caption="Realfilmserien" src="../../resources/images/real-series.png"></image-tile
                        ></link-element>
                        <link-element .hash="${getPageName(RealMoviesPage)}"
                            ><image-tile caption="Realfilme" src="../../resources/images/real-movies.png"></image-tile
                        ></link-element>
                        <link-element .hash="${getPageName(JDramaPage)}"
                            ><image-tile caption="J-Dramen" src="../../resources/images/j-drama.png"></image-tile
                        ></link-element>
                    </div>
                    <div id="tile-link-section">
                        <link-element .hash="${getPageName(MusicPage)}"
                            ><image-tile caption="Musik" src="../../resources/images/music.png"></image-tile
                        ></link-element>
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
