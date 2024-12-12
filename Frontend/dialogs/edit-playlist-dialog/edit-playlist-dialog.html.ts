import { html } from 'lit-element';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { Language } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { EditPlaylistDialog } from './edit-playlist-dialog';

/**
 * @param { EditPlaylistDialog } dialog
 */
export function renderEditPlaylistDialog(dialog) {
    return html`
        <dialog-base
            showBorder
            canAccept
            caption="Playlist bearbeiten"
            acceptActionText="Speichern"
            declineActionText="Abbrechen"
        >
            <div id="container">
                <div id="meta-configuration">
                    <div id="image-data-section">
                        <upload-area
                            id="playlist-image"
                            @imageReceived="${(e) => dialog.changeProperty('image', e.imageData)}"
                        ></upload-area>
                        <div id="playlist-rating">
                            <star-rating
                                max="5"
                                singleSelect
                                @selectionChange="${(e) => dialog.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                        </div>
                    </div>
                    <div id="text-data-section">
                        <div id="playlist-name" class="property">
                            <div class="property-label">Name:</div>
                            <input
                                class="property-value"
                                .value="${dialog.newPlaylist.name}"
                                oninput="this.dispatchEvent(new Event('change'))"
                                @change="${(e) => dialog.changeProperty('name', e.currentTarget.value)}"
                            />
                        </div>
                        <div id="playlist-author" class="property">
                            <div class="property-label">Autor:</div>
                            <input
                                class="property-value"
                                .value="${dialog.newPlaylist.author}"
                                oninput="this.dispatchEvent(new Event('change'))"
                                @change="${(e) => dialog.changeProperty('author', e.currentTarget.value)}"
                            />
                        </div>
                        <div id="playlist-genres" class="property">
                            <div class="property-label">Genres:</div>
                            <div class="property-value">
                                ${dialog.newPlaylist.genres.map(
                                    (genre) => html`<tag-label
                                        .text="${genre}"
                                        @removed="${() => dialog.removeGenre(genre)}"
                                    ></tag-label>`
                                )}
                                <tag-label
                                    createNew
                                    .autocomplete="${dialog.autocompleteGenres}"
                                    @tagCreated="${(e) => dialog.addGenre(e.detail.value)}"
                                ></tag-label>
                            </div>
                        </div>
                        <div id="playlist-language" class="property">
                            <div class="property-label">Sprache:</div>
                            <div class="property-value">
                                <drop-down
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(Language),
                                        dialog.newPlaylist.language
                                    )}"
                                    @selectionChange="${(e) => dialog.changeProperty('language', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                        </div>
                        <div id="playlist-nation" class="property">
                            <div class="property-label">Nation:</div>
                            <div class="property-value">
                                <drop-down
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(Language),
                                        dialog.newPlaylist.nation
                                    )}"
                                    @selectionChange="${(e) => dialog.changeProperty('nation', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="tracks-section" @dragover="${dialog.handleFilesDragOver}">
                    ${dialog.draggingFiles
                        ? html`<div
                              id="drag-info-overlay"
                              @dragleave="${(e) => {
                                  e.preventDefault();
                                  dialog.draggingFiles = false;
                              }}"
                              @drop="${dialog.dropFiles}"
                          ></div>`
                        : ''}
                    <div id="tracks-actions">
                        <div
                            id="import-icon"
                            class="track-action"
                            icon="${Icons.Import}"
                            @click="${() => dialog.openImportDialog()}"
                        ></div>
                        <div
                            id="trash-icon"
                            class="track-action"
                            @click="${() => dialog.clearTracks()}"
                            icon="${Icons.Trash}"
                        ></div>
                    </div>
                    <ordered-list
                        id="tracks-container"
                        .items="${dialog.newPlaylist?.tracks ?? []}"
                        @items-changed="${(e) => dialog.changeProperty('tracks', e.detail)}"
                        propertyName="name"
                    ></ordered-list>
                </div>
            </div>
        </dialog-base>
    `;
}
