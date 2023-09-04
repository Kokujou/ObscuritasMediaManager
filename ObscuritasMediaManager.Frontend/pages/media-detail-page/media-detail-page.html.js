import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { html } from '../../exports.js';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option.js';
import {
    ContentWarning,
    MediaCategory,
    MediaStatus,
    Nation,
    TargetGroup,
} from '../../obscuritas-media-manager-backend-client.js';
import { registerContentWarnings } from '../../resources/icons/content-warnings/register-content-warnings.js';
import { registerTargetGroups } from '../../resources/icons/target-groups/register-target-groups.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { MediaDetailPage } from './media-detail-page.js';

/**
 * @param {MediaDetailPage} detailPage
 */
export function renderMediaDetailPage(detailPage) {
    return html`
        <style>
            .media-image {
                background-image: url(${detailPage.updatedMedia.image});
            }
        </style>
        ${registerContentWarnings()};
        <!-- -->
        ${registerTargetGroups()};

        <div
            id="edit-button"
            onclick="this.dispatchEvent(new CustomEvent('toggle'))"
            @toggle="${(e) => (detailPage.editMode = !detailPage.editMode)}"
        >
            <custom-toggle
                .state="${detailPage.editMode ? CheckboxState.Ignore : CheckboxState.Forbid}"
                @toggle="${(e) => (detailPage.editMode = e.detail == CheckboxState.Ignore)}"
                id="edit-toggle"
            ></custom-toggle>
            <div id="toggle-edit-text">${detailPage.editMode ? 'Bearbeitung deaktivieren' : 'Bearbeitung aktivieren'}</div>
        </div>
        <page-layout>
            <div id="media-detail-container">
                <div id="content-panels">
                    <div id="left-panel" ?disabled="${!detailPage.editMode}">
                        <media-tile
                            displayStyle="simple"
                            ?disabled="${!detailPage.editMode}"
                            .imageSource="${detailPage.updatedMedia.image}"
                            @imageReceived="${(e) => detailPage.addImage(e.detail.imageData)}"
                        >
                            ${detailPage.updatedMedia.image
                                ? html`<div id="delete-icon-container">
                                      <div id="delete-icon" @click="${() => detailPage.deleteImage()}"></div>
                                  </div>`
                                : ''}
                        </media-tile>
                        <div id="media-rating" ?disabled="${!detailPage.editMode}">${renderRating(detailPage)}</div>
                    </div>
                    <div id="middle-panel" ?disabled="${!detailPage.editMode}">
                        <div id="content-warning-section" class="property-entry">
                            <div class="property-name">Inhaltswarnungen:</div>
                            <div id="content-warnings">
                                ${Object.values(ContentWarning).map(
                                    (warning) =>
                                        html`<div
                                            class="content-warning-icon-wrapper"
                                            ?selected="${detailPage.updatedMedia.contentWarnings.includes(warning)}"
                                            @click="${() => detailPage.toggleContentWarning(warning)}"
                                        >
                                            <div class="content-warning-icon" content-warning="${warning}"></div>
                                            <div class="content-warning-label">${warning}</div>
                                        </div>`
                                )}
                            </div>
                        </div>
                    </div>
                    <div id="right-panel">
                        <link-element id="prev-link" search="guid=${detailPage.prevMediaId}">&LeftArrow; Letzer</link-element>
                        <link-element id="next-link" search="guid=${detailPage.nextMediaId}">Nächster &RightArrow;</link-element>

                        <div id="media-heading">
                            <input
                                ?disabled="${!detailPage.editMode}"
                                type="text"
                                id="media-name"
                                @change="${() => detailPage.changeProperty('name', detailPage.nameInputValue)}"
                                class="property-value"
                                .value="${detailPage.updatedMedia.name}"
                                .defaultValue="${detailPage.updatedMedia.name}"
                            />
                        </div>
                        ${renderGenreSection(detailPage)}
                        <div id="right-panel-top">
                            <div id="right-panel-left-side">
                                <div class="property-entry">
                                    <div class="property-name">Release:</div>
                                    <input
                                        id="release-input"
                                        ?disabled="${!detailPage.editMode}"
                                        type="text"
                                        class="property-value"
                                        .value="${detailPage.updatedMedia.release.toString()}"
                                        .defaultValue="${detailPage.updatedMedia.release.toString()}"
                                        @input="${(e) => detailPage.releaseInput(e.currentTarget)}"
                                        @change="${(e) => detailPage.releaseChanged(e.currentTarget)}"
                                    />
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Kategorie:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${!detailPage.editMode}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(MediaCategory),
                                            detailPage.updatedMedia.type
                                        )}"
                                    ></drop-down>
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Sprache:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${!detailPage.editMode}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(Nation),
                                            detailPage.updatedMedia.language
                                        )}"
                                        @selectionChange="${(e) => detailPage.changeProperty('language', e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Status:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${!detailPage.editMode}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(MediaStatus),
                                            detailPage.updatedMedia.status
                                        )}"
                                        @selectionChange="${(e) => detailPage.changeProperty('status', e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                            </div>
                            <div id="target-group-section" class="property-entry" ?disabled="${!detailPage.editMode}">
                                <div class="property-name">Zielgruppe:</div>
                                <div
                                    id="target-group-icon"
                                    target-group="${detailPage.updatedMedia.targetGroup}"
                                    @click="${() =>
                                        detailPage.changeProperty(
                                            'targetGroup',
                                            Enum.nextValue(TargetGroup, detailPage.updatedMedia.targetGroup, true)
                                        )}"
                                ></div>
                                <svg id="target-group-label" viewbox="0 0 100 40">
                                    <text textLength="100" x="0" y="50%" lengthAdjust="spacingAndGlyphs" fill="white">
                                        ${detailPage.updatedMedia.targetGroup}
                                    </text>
                                </svg>
                            </div>
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
                                .value="${detailPage.updatedMedia.description}"
                                .defaultValue="${detailPage.updatedMedia.description}"
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
                        <div id="season-inner" id="season-inner" @scroll="${() => detailPage.requestFullUpdate()}">
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
                                    ${detailPage.updatedMedia.name} - ${entry.season}: Episode ${entry.episode}
                                </div>`
                        )}
                    </div>
                </div>
            </div>
        </page-layout>
    `;
}

/**
 * @param {MediaDetailPage} page
 */
function renderGenreSection(page) {
    return html`<div class="property-entry genre-entry">
        <div class="property-name">Genres:</div>
        <div class="property-value">
            ${page.updatedMedia.genres.map(
                (x) =>
                    html`<tag-label
                        ?disabled="${!page.editMode}"
                        @removed="${() =>
                            page.changeProperty(
                                'genres',
                                page.updatedMedia.genres.filter((genre) => genre != x)
                            )}"
                        .text="${x}"
                    ></tag-label>`
            )}
            ${page.editMode ? html` <div id="add-genre-button" @click="${() => page.showGenreSelectionDialog()}">+</div> ` : ''}
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
                    class="star ${rating < detailPage.updatedMedia.rating ? 'selected' : ''} ${rating < detailPage.hoveredRating
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
