import { html } from '../../exports.js';
import { importIcon } from '../../resources/icons/import-icon.svg.js';
import { plusIcon } from '../../resources/icons/plus-icon.svg.js';
import { changePage } from '../../services/extensions/url.extension.js';
import { MediaPage } from './media-page.js';

/**
 * @param {MediaPage} mediaPage
 */
export function renderMediaPageTemplate(mediaPage, inner) {
    return html`<page-layout>
        <div class="media-page-container">
            <media-search
                @filterUpdated="${(e) => mediaPage.updateSearchFilter(e.detail)}"
                .episodeCountFilter="${mediaPage.filterData.episodeCountFilter}"
                .genreFilter="${mediaPage.filterData.genreFilter}"
                .ratingFilter="${mediaPage.filterData.ratingFilter}"
                .searchText="${mediaPage.filterData.searchText}"
            ></media-search>
            <div class="search-result-container">
                <div class="left-container">
                    <div class="filter-options"></div>
                    <div class="ranking-table"></div>
                </div>
                <div class="right-container">
                    <media-tile
                        id="123"
                        name="Eintrag hinzufügen"
                        .imageSource="data:image/svg+xml;base64,${btoa(plusIcon())}"
                        displayStyle="simple"
                    ></media-tile>
                    <media-tile
                        .imageSource="data:image/svg+xml;base64,${btoa(importIcon())}"
                        name="Ordner importieren"
                        displayStyle="simple"
                        @click="${() => mediaPage.importFolder()}"
                    ></media-tile>
                    ${mediaPage.filteredMedia.map(
                        (media) =>
                            html`
                                <media-tile
                                    .genres="${media.genres || []}"
                                    .name="${media.name}"
                                    .rating="${media.rating}"
                                    .status="${media.state}"
                                    .imageSource="${media.image}"
                                    @imageReceived="${(e) => mediaPage.addImageFor(media, e.detail.imageData)}"
                                    @ratingChanged="${(e) => mediaPage.updateRating(media, e.detail.newRating)}"
                                    @genresChanged="${(e) => mediaPage.updateGenres(media, e.detail.genres)}"
                                    @click="${() =>
                                        changePage(
                                            location.hash.length > 1 ? location.hash.substr(1) : 'empty',
                                            `?name=${media.name}&type=${media.type}`
                                        )}"
                                ></media-tile>
                            `
                    )}

                    <input type="file" id="folder-browser" webkitdirectory directory style="display:none" />

                    <input type="file" id="file-browser" webkitdirectory style="display:none" />
                </div>
            </div>
        </div>
    </page-layout>`;
}
