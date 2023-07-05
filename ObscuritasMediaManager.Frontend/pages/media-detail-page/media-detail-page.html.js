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
        <div
            id="edit-button"
            onclick="this.dispatchEvent(new CustomEvent('toggle'))"
            @toggle="${(e) => (detailPage.editMode = !detailPage.editMode)}"
        >
            <custom-toggle ?checked="${detailPage.editMode}" id="edit-toggle"></custom-toggle>
            <div id="toggle-edit-text">${detailPage.editMode ? 'Bearbeitung deaktivieren' : 'Bearbeitung aktivieren'}</div>
        </div>
        <page-layout>
            <div id="media-detail-container">
                <div id="content-panels">
                    <div id="left-panel">
                        <media-tile
                            displayStyle="simple"
                            .imageSource="${detailPage.media.image}"
                            @imageReceived="${(e) => detailPage.addImage(e.detail.imageData)}"
                        >
                            ${detailPage.media.image
                                ? html`<div id="delete-icon-container">
                                      <div id="delete-icon" @click="${() => detailPage.deleteImage()}"></div>
                                  </div>`
                                : ''}
                        </media-tile>
                        <div id="media-rating" ?disabled="${!detailPage.editMode}">${renderRating(detailPage)}</div>
                    </div>
                    <div id="middle-panel">
                        <div class="property-entry">
                            <div class="property-name">Inhaltswarnungen:</div>
                            <div id="content-warnings"></div>
                        </div>
                    </div>
                    <div id="right-panel">
                        <div id="media-heading">
                            <input
                                ?disabled="${!detailPage.editMode}"
                                type="text"
                                id="media-name"
                                @change="${() => detailPage.changeProperty('name', detailPage.nameInputValue)}"
                                @keyup="${(e) => detailPage.handleKeyPress(e)}"
                                class="property-value"
                                .value="${detailPage.media.name}"
                                .defaultValue="${detailPage.media.name}"
                            />
                        </div>
                        ${renderGenreSection(detailPage)}
                        <div class="property-entry">
                            <div class="property-name">Release:</div>
                            <input
                                ?disabled="${!detailPage.editMode}"
                                type="text"
                                class="property-value"
                                .value="${detailPage.media.release.toString()}"
                                .defaultValue="${detailPage.media.release.toString()}"
                            />
                        </div>
                        <div class="property-group">
                            <div class="property-entry">
                                <div class="property-name">Beschreibung:</div>
                            </div>
                            <textarea
                                ?disabled="${!detailPage.editMode}"
                                class="textarea property-value"
                                id="description-input"
                                onclick="this.focus()"
                                @change="${() => detailPage.changeProperty('description', detailPage.descriptionInputValue)}"
                                @keyup="${(e) => detailPage.handleKeyPress(e)}"
                                .value="${detailPage.media.description}"
                                .defaultValue="${detailPage.media.description}"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div id="streaming-panel">
                    <div id="season-scroll-area">
                        <div
                            class="arrow ${(!detailPage.seasonScrollContainer || detailPage.seasonScrollContainer.scrollLeft) == 0
                                ? 'inactive'
                                : ''}"
                            @click="${() => detailPage.seasonScrollContainer.scrollBy({ left: -150, behavior: 'smooth' })}"
                        >
                            ◀
                        </div>
                        <div id="season-inner" id="season-inner" @scroll="${() => detailPage.requestUpdate(undefined)}">
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
                        <div
                            id="arrow ${detailPage.seasonScrollContainer &&
                            detailPage.seasonScrollContainer.scrollLeft >=
                                detailPage.seasonScrollContainer.scrollWidth - detailPage.seasonScrollContainer.offsetWidth
                                ? 'inactive'
                                : ''}"
                            @click="${() => detailPage.seasonScrollContainer.scrollBy({ left: 150, behavior: 'smooth' })}"
                        >
                            ▶
                        </div>
                    </div>
                    <div id="season-content">
                        ${detailPage.episodes.map(
                            (entry) =>
                                html`<div @click="${() => detailPage.openVideoPlayer(entry)}" class="link">
                                    ${detailPage.media.name} - ${entry.season}: Episode ${entry.episode}
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
            ${detailPage.media.genres.map(
                (x) =>
                    html`<tag-label
                        @removed="${() =>
                            detailPage.changeProperty(
                                'genres',
                                detailPage.media.genres.filter((genre) => genre != x)
                            )}"
                        .text="${x}"
                    ></tag-label>`
            )}
            ${detailPage.editMode
                ? html` <div id="add-genre-button" @click="${() => detailPage.showGenreSelectionDialog()}">+</div> `
                : ''}
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
                    class="star ${rating < detailPage.media.rating ? 'selected' : ''} ${rating < detailPage.hoveredRating
                        ? 'hovered'
                        : ''}"
                    @pointerover="${() => (detailPage.hoveredRating = rating + 1)}"
                    @pointerout="${() => (detailPage.hoveredRating = 0)}"
                    @click="${() => detailPage.changeProperty('rating', rating + 1)}"
                >
                    ★
                </div>
            `
    );
}
