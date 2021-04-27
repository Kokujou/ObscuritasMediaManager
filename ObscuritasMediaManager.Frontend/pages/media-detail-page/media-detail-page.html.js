import { html } from '../../exports.js';
import { MediaDetailPage } from './media-detail-page.js';

/**
 * @param {MediaDetailPage} detailPage
 */
export function renderMediaDetailPage(detailPage) {
    return html`
        <style>
            .media-image {
                background-image: url(${detailPage.media.image});
            }
        </style>

        <page-layout>
            <div class="media-detail-container">
                <div class="content-panels">
                    <div class="left-panel">
                        <anime-tile
                            displayStyle="simple"
                            .imageSource="${detailPage.media.image}"
                            @imageReceived="${(e) => detailPage.addImage(e.detail.imageData)}"
                        >
                            ${detailPage.media.image
                                ? html`<div class="delete-icon-container">
                                      <div class="delete-icon" @click="${() => detailPage.deleteImage()}"></div>
                                  </div>`
                                : ''}
                        </anime-tile>
                        <div class="media-rating">${renderRating(detailPage)}</div>
                    </div>
                    <div class="right-panel">
                        <div class="media-heading">
                            <input disabled type="text" class="property-value" value="${detailPage.media.name}" />
                            <div class="edit-icon" @click="${(e) => detailPage.enableEditingFor(e.target)}"></div>
                        </div>
                        ${renderGenreSection(detailPage)}
                        <div class="property-entry">
                            <div class="property-name">Release:</div>
                            <input disabled type="text" class="property-value" value="${detailPage.media.release}" />
                            <div class="edit-icon" @click="${(e) => detailPage.enableEditingFor(e.target)}"></div>
                        </div>
                        <div class="property-entry">
                            <div class="property-name">Inhaltswarnungen:</div>
                            <div class="content-warnings"></div>
                            <div class="edit-icon"></div>
                        </div>
                        <div class="property-group">
                            <div class="property-entry">
                                <div class="property-name">Beschreibung:</div>
                                <div class="edit-icon" @click="${(e) => detailPage.enableEditingFor(e.target.parentNode)}"></div>
                            </div>
                            <div class="textarea property-value" value="">${detailPage.media.description}</div>
                        </div>
                    </div>
                </div>
                <div class="streaming-panel">
                    <div class="season-scroll-area">
                        ${detailPage.seasons.map(
                            (season, index) =>
                                html`<div
                                    @click="${() => (detailPage.selectedSeason = index)}"
                                    class="link ${detailPage.selectedSeason == index ? 'active' : ''}"
                                >
                                    ${season}
                                </div>`
                        )}
                    </div>
                    <div class="season-content">
                        ${detailPage.episodes.map(
                            (entry) =>
                                html`<div @click="${() => detailPage.openVideoPlayer(entry)}" class="link">
                                    ${entry.name} - ${entry.season}: Episode ${entry.episode}
                                </div>`
                        )}
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}

/**
 * @param {MediaDetailPage} detailPage
 */
function renderGenreSection(detailPage) {
    return html`<div class="property-entry genre-entry">
        <div class="property-name">Genres:</div>
        <div class="property-value">
            ${detailPage.media.genres.map((x) => html`<tag-label @removed="${() => detailPage.removeGenre(x)}" .text="${x}"></tag-label>`)}
            ${detailPage.newGenre ? html`<tag-label .createNew="${true}"></tag-label>` : ''}
            <div class="add-genre-button" @click="${() => detailPage.showGenreSelectionDialog()}">+</div>
        </div>
    </div> `;
}

/**
 * @param {MediaDetailPage} detailPage
 */
function renderRating(detailPage) {
    var ratingArray = [...Array(5).keys()];
    return ratingArray.map(
        (rating) =>
            html`
                <div
                    class="star ${rating < detailPage.media.rating ? 'selected' : ''} ${rating < detailPage.hoveredRating ? 'hovered' : ''}"
                    @pointerover="${() => (detailPage.hoveredRating = rating + 1)}"
                    @pointerout="${() => (detailPage.hoveredRating = 0)}"
                    @click="${() => detailPage.changeRating(rating + 1)}"
                >
                    ★
                </div>
            `
    );
}
