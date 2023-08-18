import { html } from '../../exports.js';
import { getPageName } from '../../services/extensions/url.extension.js';
import { MediaPage } from '../media-page/media-page.js';
import { MusicPage } from '../music-page/music-page.js';
import { RecipesPage } from '../recipes-page/recipes-page.js';

export function renderWelcomePage() {
    return html`
        <page-layout>
            <div id="welcome-page">
                <div id="tile-link-area">
                    <div id="tile-link-section">
                        <link-element .hash="${getPageName(MediaPage)}"
                            ><image-tile caption="${MediaPage.pageName}" src="../../resources/images/real-series.png"></image-tile
                        ></link-element>
                    </div>
                    <div id="tile-link-section">
                        <link-element .hash="${getPageName(MusicPage)}">
                            <image-tile caption="${MusicPage.pageName}" src="../../resources/images/music.png"></image-tile
                        ></link-element>
                        <link-element .hash="${getPageName(RecipesPage)}">
                            <image-tile caption="${RecipesPage.pageName}" src="../../resources/images/food.png"></image-tile
                        ></link-element>
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
