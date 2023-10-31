import { html } from '../../exports.js';
import { LinkElement } from '../../native-components/link-element/link-element.js';
import { importIcon } from '../../resources/inline-icons/general/import-icon.svg.js';
import { plusIcon } from '../../resources/inline-icons/general/plus-icon.svg.js';
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
                                  @click="${() => page.importFolder()}"
                              ></media-tile>
                              ${page.filteredMedia.map((media) =>
                                  LinkElement.forPage(
                                      MediaDetailPage,
                                      {},
                                      html`
                                          <media-tile
                                              .genres="${media.genres || []}"
                                              .name="${media.name}"
                                              .rating="${media.rating}"
                                              .status="${media.status}"
                                              .imageSource="${media.image}"
                                              .autocompleteGenres="${page.genreList}"
                                              @imageReceived="${(e) => page.addImageFor(media, e.detail.imageData)}"
                                              @ratingChanged="${(e) =>
                                                  page.changePropertyOf(media, 'rating', e.detail.newRating)}"
                                              @genresChanged="${(e) => page.changePropertyOf(media, 'genres', e.detail.genres)}"
                                          ></media-tile>
                                      `
                                  )
                              )}
                          </div>`}
                </paginated-scrolling>
            </div>
        </page-layout>
        <input type="file" id="folder-browser" webkitdirectory directory style="display:none" />
        <input type="file" id="file-browser" webkitdirectory style="display:none" />`;
}
