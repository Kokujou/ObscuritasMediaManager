import { html } from 'lit-element';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { LinkElement } from '../../native-components/link-element/link-element';
import { ContentWarning, Language, MediaCategory, MediaStatus, TargetGroup } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { createRange, groupBy } from '../../services/extensions/array.extensions';
import { Enum } from '../../services/extensions/enum.extensions';
import { MusicPlaylistPage } from '../music-playlist-page/music-playlist-page';
import { MediaDetailPage } from './media-detail-page';

/**
 * @param {MediaDetailPage} detailPage
 */
export function renderMediaDetailPage(detailPage: MediaDetailPage) {
    return html`
        <img
            id="dummy-image"
            src="${detailPage.imageUrl}"
            @load="${() => (detailPage.hasImage = true)}"
            @error="${() => (detailPage.hasImage = false)}"
        />
        <div
            id="edit-button"
            onclick="this.dispatchEvent(new CustomEvent('toggle'))"
            @toggle="${(e) => detailPage.changeProperty('complete', !detailPage.updatedMedia.complete)}"
        >
            <custom-toggle
                .state="${detailPage.updatedMedia.complete ? CheckboxState.Ignore : CheckboxState.Forbid}"
                id="edit-toggle"
            ></custom-toggle>
            <div id="toggle-edit-text">${detailPage.updatedMedia.complete ? 'Vollständig' : 'Unvollständig'}</div>
        </div>
        <page-layout>
            <div id="media-detail-container">
                <div id="content-panels">
                    <div id="left-panel" ?disabled="${detailPage.updatedMedia.complete}">
                        <div id="media-image-container">
                            ${detailPage.hasImage
                                ? html`<div
                                      id="media-image"
                                      style="background-image: url('${detailPage.imageUrl}')"
                                      @click="${() => detailPage.setMediaImage(null)}"
                                  ></div>`
                                : html`<upload-area
                                      @imageReceived="${(e) => detailPage.setMediaImage(e.detail.imageData)}"
                                  ></upload-area>`}
                        </div>

                        <div id="media-rating" ?disabled="${detailPage.updatedMedia.complete}">
                            <star-rating
                                max="5"
                                singleSelect
                                .values="${createRange(0, detailPage.updatedMedia.rating)}"
                                @ratingChanged="${(e) => detailPage.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                        </div>
                    </div>
                    <div id="middle-panel" ?disabled="${detailPage.updatedMedia.complete}">
                        <div id="content-warning-section" class="property-entry">
                            <div class="property-name">Inhaltswarnungen:</div>
                            <div id="content-warnings">
                                ${Object.values(ContentWarning).map(
                                    (warning) =>
                                        html`<div
                                            class="content-warning-icon-wrapper"
                                            ?selected="${detailPage.updatedMedia?.contentWarnings?.includes(warning)}"
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
                        ${detailPage.createNew
                            ? ''
                            : html` <div id="navigation">
                                  ${detailPage.prevMediaId
                                      ? LinkElement.forPage(
                                            MediaDetailPage,
                                            { mediaId: detailPage.prevMediaId },
                                            html`&LeftArrow; Letzter`,
                                            {
                                                id: 'prev-link',
                                            }
                                        )
                                      : ''}
                                  ${detailPage.nextMediaId
                                      ? LinkElement.forPage(
                                            MediaDetailPage,
                                            { mediaId: detailPage.nextMediaId },
                                            html`Nächster &RightArrow;`,
                                            {
                                                id: 'next-link',
                                            }
                                        )
                                      : ''}
                              </div>`}

                        <div id="media-heading">
                            <div
                                id="popup-icon"
                                icon="${Icons.Popup}"
                                tooltip="Auf AniList suchen"
                                @click="${() => detailPage.openMediaExternal()}"
                            ></div>
                            <input
                                ?disabled="${detailPage.updatedMedia.complete}"
                                type="text"
                                id="media-name"
                                @change="${() => detailPage.changeProperty('name', detailPage.nameInputValue)}"
                                class="property-value"
                                .value="${detailPage.updatedMedia.name}"
                            />
                        </div>

                        <link-element
                            id="trailer-link"
                            href="https://www.youtube.com/results?search_query=${detailPage.updatedMedia.name}%20trailer"
                            target="_blank"
                            >Trailer suchen</link-element
                        >
                        ${detailPage.isJapanese
                            ? html` <div class="property-entry sub-entry">
                                      <div class="property-name">Romaji:</div>
                                      <input
                                          ?disabled="${detailPage.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${detailPage.updatedMedia.romajiName}"
                                          @change="${(e) => detailPage.changeProperty('romajiName', e.currentTarget.value)}"
                                      />
                                  </div>
                                  <div class="property-entry sub-entry">
                                      <div class="property-name">Kanji:</div>
                                      <input
                                          ?disabled="${detailPage.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${detailPage.updatedMedia.kanjiName}"
                                          @change="${(e) => detailPage.changeProperty('kanjiName', e.currentTarget.value)}"
                                      />
                                  </div>
                                  <div class="property-entry sub-entry">
                                      <div class="property-name">Deutsch:</div>
                                      <input
                                          ?disabled="${detailPage.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${detailPage.updatedMedia.germanName}"
                                          @change="${(e) => detailPage.changeProperty('germanName', e.currentTarget.value)}"
                                      />
                                  </div>
                                  <div class="property-entry sub-entry">
                                      <div class="property-name">Englisch:</div>
                                      <input
                                          ?disabled="${detailPage.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${detailPage.updatedMedia.englishName}"
                                          @change="${(e) => detailPage.changeProperty('englishName', e.currentTarget.value)}"
                                      />
                                  </div>`
                            : ''}

                        <div class="separator"></div>
                        ${renderGenreSection(detailPage)}
                        <div id="right-panel-top">
                            <div id="right-panel-left-side">
                                <div class="property-entry">
                                    <div class="property-name">Release:</div>
                                    <input
                                        id="release-input"
                                        ?disabled="${detailPage.updatedMedia.complete}"
                                        type="text"
                                        class="property-value"
                                        .value="${detailPage.updatedMedia.release.toString()}"
                                        @input="${(e) => detailPage.releaseInput(e.currentTarget)}"
                                        @change="${(e) => detailPage.releaseChanged(e.currentTarget)}"
                                    />
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Kategorie:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${detailPage.updatedMedia.complete}"
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
                                        ?disabled="${detailPage.updatedMedia.complete}"
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
                                        ?disabled="${detailPage.updatedMedia.complete}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(MediaStatus),
                                            detailPage.updatedMedia.status
                                        )}"
                                        @selectionChange="${(e) => detailPage.changeProperty('status', e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                            </div>
                            <div id="target-group-section" class="property-entry" ?disabled="${detailPage.updatedMedia.complete}">
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
                                <svg id="target-group-label" viewbox="0 0 100 30">
                                    <text
                                        textLength="100"
                                        x="0"
                                        y="50%"
                                        lengthAdjust="spacingAndGlyphs"
                                        fill="white"
                                        dominant-baseline="central"
                                    >
                                        ${detailPage.updatedMedia.targetGroup}
                                    </text>
                                </svg>
                            </div>
                        </div>
                        ${detailPage.relatedTracks.length > 0
                            ? html`
                                  <div id="related-tracks-section" class="property-group">
                                      <div class="property-entry">
                                          <div class="property-name" style="width: unset">Verwandte Songs:</div>
                                      </div>
                                      ${detailPage.relatedTracks.map(
                                          (track) => html`
                                              <div class="property-entry">
                                                  ♫
                                                  ${LinkElement.forPage(
                                                      MusicPlaylistPage,
                                                      { trackHash: track.hash },
                                                      track.name,
                                                      { class: 'track-name' }
                                                  )}
                                                  <compact-audio-player .path="${track?.path}"></compact-audio-player>
                                              </div>
                                          `
                                      )}
                                  </div>
                              `
                            : ''}
                    </div>
                </div>
                <div id="description-section" class="property-group" style="margin: 30px">
                    <div class="property-entry">
                        <div class="property-name">Beschreibung:</div>
                    </div>
                    <textarea
                        ?disabled="${detailPage.updatedMedia.complete}"
                        class="textarea property-value"
                        id="description-input"
                        onclick="this.focus()"
                        @change="${(e) => detailPage.changeProperty('description', e.currentTarget.value)}"
                        .value="${detailPage.updatedMedia.description}"
                    ></textarea>
                </div>
                ${detailPage.createNew
                    ? html`
                          <div id="action-row">
                              <div id="create-entry-link" @click="${() => detailPage.createEntry()}">
                                  <div id="create-entry-icon" icon="${Icons.SaveTick}"></div>
                                  <div id="create-entry-text">Eintrag erstellen</div>
                              </div>
                          </div>
                      `
                    : ''}
                <div id="path-row">
                    <label>Basispfad: </label>
                    <input
                        id="path"
                        type="text"
                        readonly
                        value="${detailPage.updatedMedia.rootFolderPath ?? 'Kein Pfad ausgewählt'}"
                    />
                    <div
                        id="edit-path-button"
                        icon="${Icons.Edit}"
                        ?disabled="${detailPage.updatedMedia.complete}"
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
function renderGenreSection(page: MediaDetailPage) {
    return html`<div class="property-entry genre-entry">
        <div class="property-name">Genres:</div>
        <div class="property-value">
            ${Object.entries(groupBy(page.updatedMedia?.genres, 'section'))
                .flatMap((x) => x[1])
                .map(
                    (x) =>
                        html`<tag-label
                            ?disabled="${page.updatedMedia.complete}"
                            @removed="${() =>
                                page.changeProperty(
                                    'genres',
                                    page.updatedMedia.genres.filter((genre) => genre != x)
                                )}"
                            .text="${x.name}"
                        ></tag-label>`
                )}
            ${!page.updatedMedia.complete
                ? html` <div id="add-genre-button" @click="${() => page.showGenreSelectionDialog()}">+</div> `
                : ''}
        </div>
    </div> `;
}
