import { html } from '../../exports.js';
import { LinkElement } from '../../native-components/link-element/link-element.js';
import { MediaPage } from '../media-page/media-page.js';
import { MusicPage } from '../music-page/music-page.js';
import { RecipesPage } from '../recipes-page/recipes-page.js';

export function renderWelcomePage() {
    return html`
        <page-layout>
            <div id="welcome-page">
                <div id="tile-link-area">
                    <div id="tile-link-section">
                        ${LinkElement.forPage(
                            MediaPage,
                            null,
                            html`<image-tile caption="${MediaPage.pageName}" src="resources/images/real-series.png"></image-tile>`
                        )}
                    </div>
                    <div id="tile-link-section">
                        ${LinkElement.forPage(
                            MusicPage,
                            null,
                            html` <image-tile caption="${MusicPage.pageName}" src="resources/images/music.png"></image-tile>`
                        )}
                        ${LinkElement.forPage(
                            RecipesPage,
                            null,
                            html` <image-tile caption="${RecipesPage.pageName}" src="resources/images/food.png"></image-tile>`
                        )}
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}
