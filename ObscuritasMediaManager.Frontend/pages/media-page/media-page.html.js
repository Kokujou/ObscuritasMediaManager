import { session } from '../../data/session.js';
import { html } from '../../exports.js';
import { importIcon } from '../../resources/icons/general/import-icon.svg.js';
import { plusIcon } from '../../resources/icons/general/plus-icon.svg.js';
import { MediaPage } from './media-page.js';

/**
 * @param {MediaPage} mediaPage
 */
export function renderMediaPageTemplate(mediaPage, inner) {
    return html`<page-layout>
        <div id="media-page-container">
            <media-search
                @filterUpdated="${(e) => mediaPage.updateSearchFilter(e.detail)}"
                .episodeCountFilter="${mediaPage.filterData.episodeCountFilter}"
                .genreFilter="${mediaPage.filterData.genreFilter}"
                .ratingFilter="${mediaPage.filterData.ratingFilter}"
                .searchText="${mediaPage.filterData.searchText}"
            ></media-search>
            <div id="search-result-container">
                <div id="left-container">
                    <div id="filter-options"></div>
                    <div id="ranking-table"></div>
                </div>
                <div id="right-container">
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
                                <link-element .hash="${session.currentPage.current()}" .search="guid=${media.id}">
                                    <media-tile
                                        .genres="${media.genres || []}"
                                        .name="${media.name}"
                                        .rating="${media.rating}"
                                        .status="${media.state}"
                                        .imageSource="${media.image}"
                                        @imageReceived="${(e) => mediaPage.addImageFor(media, e.detail.imageData)}"
                                        @ratingChanged="${(e) => mediaPage.changePropertyOf(media, 'rating', e.detail.newRating)}"
                                        @genresChanged="${(e) => mediaPage.changePropertyOf(media, 'genres', e.detail.genres)}"
                                    ></media-tile
                                ></link-element>
                            `
                    )}

                    <input type="file" id="folder-browser" webkitdirectory directory style="display:none" />

                    <input type="file" id="file-browser" webkitdirectory style="display:none" />
                </div>
            </div>
        </div>
    </page-layout>`;
}
