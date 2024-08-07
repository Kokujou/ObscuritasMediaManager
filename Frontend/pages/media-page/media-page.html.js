import { html } from '../../exports.js';
import { LinkElement } from '../../native-components/link-element/link-element.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { CreateMediaPage } from '../create-media-page/create-media-page.js';
import { MediaDetailPage } from '../media-detail-page/media-detail-page.js';
import { MediaPage } from './media-page.js';

/**
 * @param {MediaPage} page
 */
export function renderMediaPageTemplate(page) {
    return html`<page-layout>
        <div id="media-page-container">
            <media-filter-sidebar id="media-filter" .filter="${page.filter}" @change="${() => page.requestFullUpdate()}">
                <div slot="footer" id="result-overview">${page.filteredMedia.length} Ergebnisse gefunden</div>
            </media-filter-sidebar>
            <paginated-scrolling id="results" scrollTopThreshold="50">
                ${page.loading
                    ? html`<partial-loading></partial-loading>`
                    : html` <div id="result-container">
                          ${page.filteredMedia.map((media) =>
                              LinkElement.forPage(
                                  MediaDetailPage,
                                  { mediaId: media.id },
                                  html`
                                      <media-tile
                                          .media="${media}"
                                          .autocompleteGenres="${page.genreList}"
                                          @imageReceived="${(e) => page.changePropertyOf(media, 'image', e.detail.imageData)}"
                                          @ratingChanged="${(e) => page.changePropertyOf(media, 'rating', e.detail.newRating)}"
                                          @genresChanged="${(e) => page.changePropertyOf(media, 'genres', e.detail.genres)}"
                                          @soft-delete="${() => page.changePropertyOf(media, 'deleted', true)}"
                                          @hard-delete="${() => page.hardDelete(media)}"
                                          @full-delete="${() => page.fullDelete(media)}"
                                          @undelete="${() => page.changePropertyOf(media, 'deleted', false)}"
                                      ></media-tile>
                                  `
                              )
                          )}
                      </div>`}
            </paginated-scrolling>
            <div id="footer">
                <div id="result-options">
                    ${LinkElement.forPage(
                        CreateMediaPage,
                        {},
                        html`
                            <div
                                id="add-media-button"
                                class="option-button"
                                icon="${Icons.Plus}"
                                tooltip="Eintrag hinzufügen"
                            ></div>
                        `
                    )}
                    <div
                        id="import-media-button"
                        class="option-button"
                        icon="${Icons.Import}"
                        @pointerover="${(e) => page.requestImportTypeSelection(e)}"
                    ></div>
                    <div
                        id="cleanup-button"
                        class="option-button"
                        icon="${Icons.Clean}"
                        tooltip="Einträge bereinigen"
                        @click="${() => page.cleanupMedia()}"
                    ></div>
                </div>
            </div>
        </div>
    </page-layout> `;
}
