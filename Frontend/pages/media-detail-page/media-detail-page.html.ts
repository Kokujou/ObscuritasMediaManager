import { html } from 'lit-element';
import { CheckboxState } from '../../data/enumerations/checkbox-state';

import { Enum } from '../../extensions/enum.extensions';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { LinkElement } from '../../native-components/link-element/link-element';
import { ContentWarning, Language, MediaCategory, MediaStatus, TargetGroup } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { MusicPlaylistPage } from '../music-playlist-page/music-playlist-page';
import { MediaDetailPage } from './media-detail-page';

export function renderMediaDetailPage(this: MediaDetailPage) {
    return html`
        <img
            id="dummy-image"
            src="${this.imageUrl}"
            @load="${() => (this.hasImage = true)}"
            @error="${() => (this.hasImage = false)}"
        />
        ${!this.createNew
            ? html` <div
                  id="edit-button"
                  onclick="this.dispatchEvent(new CustomEvent('toggle'))"
                  @toggle="${(e: Event) => this.changeProperty('complete', !this.updatedMedia.complete)}"
              >
                  <custom-toggle
                      .state="${this.updatedMedia.complete ? CheckboxState.Ignore : CheckboxState.Forbid}"
                      id="edit-toggle"
                  ></custom-toggle>
                  <div id="toggle-edit-text">${this.updatedMedia.complete ? 'Vollständig' : 'Unvollständig'}</div>
              </div>`
            : ''}

        <page-layout>
            <div id="media-detail-container">
                <div id="content-panels">
                    <div id="left-panel" ?disabled="${this.updatedMedia.complete}">
                        <div id="media-image-container">
                            ${this.hasImage
                                ? html`<div
                                      id="media-image"
                                      style="background-image: url('${this.imageUrl}')"
                                      @click="${() => this.setMediaImage(null)}"
                                  ></div>`
                                : html`<upload-area
                                      @imageReceived="${(e: CustomEvent<{ imageData: string }>) =>
                                          this.setMediaImage(e.detail.imageData)}"
                                  ></upload-area>`}
                        </div>

                        <div id="media-rating" ?disabled="${this.updatedMedia.complete}">
                            <star-rating
                                max="5"
                                singleSelect
                                .values="${Array.createRange(0, this.updatedMedia.rating)}"
                                @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                                    this.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                        </div>
                    </div>
                    <div id="middle-panel" ?disabled="${this.updatedMedia.complete}">
                        <div id="content-warning-section" class="property-entry">
                            <div class="property-name">Inhaltswarnungen:</div>
                            <div id="content-warnings">
                                ${Object.values(ContentWarning).map(
                                    (warning) =>
                                        html`<div
                                            class="content-warning-icon-wrapper"
                                            ?selected="${this.updatedMedia?.contentWarnings?.includes(warning)}"
                                            @click="${() => this.toggleContentWarning(warning)}"
                                        >
                                            <div class="content-warning-icon" content-warning="${warning}"></div>
                                            <div class="content-warning-label">${warning}</div>
                                        </div>`
                                )}
                            </div>
                        </div>
                    </div>
                    <div id="right-panel">
                        ${this.createNew
                            ? ''
                            : html` <div id="navigation">
                                  ${this.prevMediaId
                                      ? LinkElement.forPage(
                                            MediaDetailPage,
                                            { mediaId: this.prevMediaId },
                                            html`&LeftArrow; Letzter`,
                                            {
                                                id: 'prev-link',
                                            }
                                        )
                                      : ''}
                                  ${this.nextMediaId
                                      ? LinkElement.forPage(
                                            MediaDetailPage,
                                            { mediaId: this.nextMediaId },
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
                                @click="${() => this.openMediaExternal()}"
                            ></div>
                            <input
                                ?disabled="${this.updatedMedia.complete}"
                                type="text"
                                id="media-name"
                                @change="${() => this.changeProperty('name', this.nameInputValue)}"
                                class="property-value"
                                .value="${this.updatedMedia.name}"
                            />
                        </div>

                        <link-element
                            id="trailer-link"
                            href="https://www.youtube.com/results?search_query=${this.updatedMedia.name}%20trailer"
                            target="_blank"
                            >Trailer suchen</link-element
                        >
                        ${this.isJapanese
                            ? html` <div class="property-entry sub-entry">
                                      <div class="property-name">Romaji:</div>
                                      <input
                                          ?disabled="${this.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${this.updatedMedia.romajiName ?? ''}"
                                          @change="${(e: Event) =>
                                              this.changeProperty('romajiName', (e.currentTarget as HTMLInputElement).value)}"
                                      />
                                  </div>
                                  <div class="property-entry sub-entry">
                                      <div class="property-name">Kanji:</div>
                                      <input
                                          ?disabled="${this.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${this.updatedMedia.kanjiName ?? ''}"
                                          @change="${(e: Event) =>
                                              this.changeProperty('kanjiName', (e.currentTarget as HTMLInputElement).value)}"
                                      />
                                  </div>
                                  <div class="property-entry sub-entry">
                                      <div class="property-name">Deutsch:</div>
                                      <input
                                          ?disabled="${this.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${this.updatedMedia.germanName ?? ''}"
                                          @change="${(e: Event) =>
                                              this.changeProperty('germanName', (e.currentTarget as HTMLInputElement).value)}"
                                      />
                                  </div>
                                  <div class="property-entry sub-entry">
                                      <div class="property-name">Englisch:</div>
                                      <input
                                          ?disabled="${this.updatedMedia.complete}"
                                          type="text"
                                          class="property-value"
                                          .value="${this.updatedMedia.englishName ?? ''}"
                                          @change="${(e: Event) =>
                                              this.changeProperty('englishName', (e.currentTarget as HTMLInputElement).value)}"
                                      />
                                  </div>`
                            : ''}

                        <div class="separator"></div>
                        ${renderGenreSection.call(this)}
                        <div id="right-panel-top">
                            <div id="right-panel-left-side">
                                <div class="property-entry">
                                    <div class="property-name">Release:</div>
                                    <input
                                        id="release-input"
                                        ?disabled="${this.updatedMedia.complete}"
                                        type="text"
                                        class="property-value"
                                        .value="${this.updatedMedia.release.toString()}"
                                        @input="${(e: Event) => this.releaseInput(e.currentTarget as HTMLInputElement)}"
                                        @change="${(e: Event) => this.releaseChanged(e.currentTarget as HTMLInputElement)}"
                                    />
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Kategorie:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${this.updatedMedia.complete}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(MediaCategory),
                                            this.updatedMedia.type
                                        )}"
                                    ></drop-down>
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Sprache:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${this.updatedMedia.complete}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(Language),
                                            this.updatedMedia.language
                                        )}"
                                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                            this.changeProperty('language', e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                                <div class="property-entry">
                                    <div class="property-name">Status:</div>
                                    <drop-down
                                        class="property-value"
                                        ?disabled="${this.updatedMedia.complete}"
                                        .options="${DropDownOption.createSimpleArray(
                                            Object.values(MediaStatus),
                                            this.updatedMedia.status
                                        )}"
                                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                            this.changeProperty('status', e.detail.option.value)}"
                                    ></drop-down>
                                </div>
                            </div>
                            <div id="target-group-section" class="property-entry" ?disabled="${this.updatedMedia.complete}">
                                <div class="property-name">Zielgruppe:</div>
                                <div
                                    id="target-group-icon"
                                    target-group="${this.updatedMedia.targetGroup}"
                                    @click="${() =>
                                        this.changeProperty(
                                            'targetGroup',
                                            Enum.nextValue(TargetGroup, this.updatedMedia.targetGroup, 'None')
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
                                        ${this.updatedMedia.targetGroup}
                                    </text>
                                </svg>
                            </div>
                        </div>
                        ${this.relatedTracks.length > 0
                            ? html`
                                  <div id="related-tracks-section" class="property-group">
                                      <div class="property-entry">
                                          <div class="property-name" style="width: unset">Verwandte Songs:</div>
                                      </div>
                                      ${this.relatedTracks.map(
                                          (track) => html`
                                              <div class="property-entry">
                                                  ♫
                                                  ${LinkElement.forPage(
                                                      MusicPlaylistPage,
                                                      { trackHash: track.hash },
                                                      track.name,
                                                      { className: 'track-name' }
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
                        ?disabled="${this.updatedMedia.complete}"
                        class="textarea property-value"
                        id="description-input"
                        onclick="this.focus()"
                        @change="${(e: Event) => this.changeProperty('description', (e.currentTarget as HTMLInputElement).value)}"
                        .value="${this.updatedMedia.description ?? ''}"
                    ></textarea>
                </div>
                ${this.createNew
                    ? html`
                          <div id="action-row">
                              <div id="create-entry-link" @click="${() => this.createEntry()}">
                                  <div id="create-entry-icon" icon="${Icons.SaveTick}"></div>
                                  <div id="create-entry-text">Eintrag erstellen</div>
                              </div>
                          </div>
                      `
                    : ''}
                <div id="path-row">
                    <label>Basispfad: </label>
                    <input id="path" type="text" readonly value="${this.updatedMedia.rootFolderPath ?? 'Kein Pfad ausgewählt'}" />
                    <div
                        id="edit-path-button"
                        icon="${Icons.Edit}"
                        ?disabled="${this.updatedMedia.complete}"
                        tooltip="PC durchsuchen"
                        @click="${() => this.changeBasePath()}"
                    ></div>
                </div>
            </div>
        </page-layout>
    `;
}

function renderGenreSection(this: MediaDetailPage) {
    return html`<div class="property-entry genre-entry">
        <div class="property-name">Genres:</div>
        <div class="property-value">
            ${Object.entries((this.updatedMedia?.genres ?? []).groupByKey('section'))
                .flatMap((x) => x[1])
                .map(
                    (x) =>
                        html`<tag-label
                            ?disabled="${this.updatedMedia.complete}"
                            @removed="${() =>
                                this.changeProperty(
                                    'genres',
                                    this.updatedMedia.genres.filter((genre) => genre != x)
                                )}"
                            .text="${x.name}"
                        ></tag-label>`
                )}
            ${!this.updatedMedia.complete
                ? html` <div id="add-genre-button" @click="${() => this.showGenreSelectionDialog()}">+</div> `
                : ''}
        </div>
    </div> `;
}
