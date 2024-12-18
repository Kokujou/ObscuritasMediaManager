import { html } from 'lit-element';
import { LinkElement } from '../../native-components/link-element/link-element';
import { GenreModel, MediaGenreModel } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { MediaDetailPage } from '../media-detail-page/media-detail-page';
import { MediaPage } from './media-page';

export function renderMediaPageTemplate(this: MediaPage) {
    return html`<page-layout>
        <div id="media-page-container">
            <media-filter-sidebar id="media-filter" .filter="${this.filter}" @change="${() => this.requestFullUpdate()}">
                <div slot="footer" id="result-overview">${this.filteredMedia.length} Ergebnisse gefunden</div>
            </media-filter-sidebar>
            <paginated-scrolling
                id="results"
                scrollTopThreshold="50"
                @scrollBottom="${() => {
                    this.page++;
                    this.requestFullUpdate();
                }}"
            >
                ${this.loading
                    ? html`<partial-loading></partial-loading>`
                    : html` <div id="result-container">
                          ${this.paginatedMedia.map((media) =>
                              LinkElement.forPage(
                                  MediaDetailPage,
                                  { mediaId: media.id },
                                  html`
                                      <media-tile
                                          .media="${media}"
                                          .autocompleteGenres="${this.genreList}"
                                          @imageReceived="${(e: CustomEvent<{ imageData: string }>) =>
                                              this.setMediaImage(media.id, e.detail.imageData)}"
                                          @ratingChanged="${(e: CustomEvent<{ newRating: number }>) =>
                                              this.changePropertyOf(media, 'rating', e.detail.newRating)}"
                                          @genresChanged="${(e: CustomEvent<{ genres: GenreModel[] }>) =>
                                              this.changePropertyOf(media, 'genres', e.detail.genres as MediaGenreModel[])}"
                                          @soft-delete="${() => this.changePropertyOf(media, 'deleted', true)}"
                                          @hard-delete="${() => this.hardDelete(media)}"
                                          @full-delete="${() => this.fullDelete(media)}"
                                          @undelete="${() => this.changePropertyOf(media, 'deleted', false)}"
                                      ></media-tile>
                                  `
                              )
                          )}
                      </div>`}
            </paginated-scrolling>
            <div id="footer">
                <div id="result-options">
                    ${LinkElement.forPage(
                        MediaDetailPage,
                        { createNew: true },
                        html`
                            <div
                                id="add-media-button"
                                class="option-button"
                                tooltip="Eintrag hinzufügen"
                                icon="${Icons.Plus}"
                            ></div>
                        `
                    )}
                    <div
                        id="import-media-button"
                        class="option-button"
                        icon="${Icons.Import}"
                        @pointerover="${(e: PointerEvent) => this.requestImportTypeSelection(e)}"
                    ></div>
                    <div
                        id="auto-fill-button"
                        class="option-button"
                        icon="${Icons.Lookup}"
                        ?disabled="${this.animeToAutoFill.length == 0}"
                        tooltip="${this.animeToAutoFill.length} Einträge automatisch verfollständigen"
                        @click="${() => this.autoFillAnime()}"
                    ></div>
                    <div
                        id="cleanup-button"
                        class="option-button"
                        icon="${Icons.Clean}"
                        tooltip="Einträge bereinigen"
                        @click="${() => this.cleanupMedia()}"
                    ></div>
                </div>
            </div>
        </div>
    </page-layout> `;
}
