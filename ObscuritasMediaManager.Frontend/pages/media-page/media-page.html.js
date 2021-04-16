import { html } from '../../exports.js';
import { importIcon } from '../../resources/icons/import-icon.svg.js';
import { MediaPage } from './media-page.js';

/**
 * @param {MediaPage} mediaPage
 */
export function renderMediaPageTemplate(mediaPage, inner) {
    return html`<page-layout>
        <div class="media-page-container">
            <media-search></media-search>
            <div class="search-result-container">
                <div class="left-container">
                    <div class="filter-options"></div>
                    <div class="ranking-table"></div>
                </div>
                <div class="right-container">
                    <anime-tile name="Anime hinzufügen" ?disabled="${true}"></anime-tile>
                    <anime-tile
                        imageSource="data:image/svg+xml;base64,${btoa(importIcon())}"
                        name="Ordner importieren"
                        ?disabled="${true}"
                        @click="${() => mediaPage.importFolder()}"
                    ></anime-tile>
                    ${mediaPage.mediaList.map(
                        (media) =>
                            html`
                                <anime-tile
                                    .genres="${media.genres || []}"
                                    .name="${media.name}"
                                    .rating="${media.rating}"
                                    .status="${media.state}"
                                    .imageSource="${media.image}"
                                    @addButtonClicked="${() => mediaPage.addImageFor(media)}"
                                    @ratingChanged="${(e) => mediaPage.changeRating(media, e.detail.newRating)}"
                                ></anime-tile>
                            `
                    )}

                    <input type="file" id="folder-browser" webkitdirectory directory style="display:none" />
                    <input type="file" id="image-browser" accept="image/*" style="display:none" />
                </div>
            </div>
        </div>
    </page-layout>`;
}
