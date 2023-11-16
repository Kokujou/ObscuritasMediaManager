import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { html } from '../../exports.js';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option.js';
import { LinkElement } from '../../native-components/link-element/link-element.js';
import {
    ContentWarning,
    Language,
    MediaCategory,
    MediaStatus,
    TargetGroup,
} from '../../obscuritas-media-manager-backend-client.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
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
                            .media="${detailPage.updatedMedia}"
                            @imageReceived="${(e) => detailPage.changeProperty('image', e.detail.imageData)}"
                        >
                            ${detailPage.updatedMedia.image
                                ? html`<div id="delete-icon-container">
                                      <div
                                          id="delete-icon"
                                          icon="${Icons.Trash}"
                                          @click="${() => detailPage.changeProperty('image', null)}"
                                      ></div>
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
                        ${LinkElement.forPage(MediaDetailPage, { mediaId: detailPage.prevMediaId }, html`&LeftArrow; Letzer`, {
                            id: 'prev-link',
                        })}
                        ${LinkElement.forPage(MediaDetailPage, { mediaId: detailPage.nextMediaId }, html`Nächster &RightArrow;`, {
                            id: 'next-link',
                        })}

                        <div id="media-heading">
                            <div
                                id="popup-icon"
                                icon="${Icons.Popup}"
                                tooltip="Auf AniList suchen"
                                @click="${() =>
                                    window.open(`https://anilist.co/search/anime?search=${detailPage.updatedMedia.name}`)}"
                            ></div>
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
                                            Object.values(Language),
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
                                            Enum.nextValue(TargetGroup, detailPage.updatedMedia.targetGroup, 'None')
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
                <div id="path-row">
                    <label>Basispfad: </label>
                    <input id="path" type="text" readonly value="${detailPage.updatedMedia.rootFolderPath}" />
                    <div
                        id="edit-path-button"
                        icon="${Icons.Edit}"
                        ?disabled="${!detailPage.editMode}"
                        tooltip="PC durchsuchen"
                        @click="${() => detailPage.changeBasePath()}"
                    ></div>
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
                        .text="${x.name}"
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
