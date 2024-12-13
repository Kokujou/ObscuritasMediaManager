import { html } from 'lit-element';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { Language } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { EditPlaylistDialog } from './edit-playlist-dialog';

export function renderEditPlaylistDialog(this: EditPlaylistDialog) {
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
                            @imageReceived="${(e: CustomEvent<{ imageData: string }>) =>
                                this.changeProperty('image', e.detail.imageData)}"
                        ></upload-area>
                        <div id="playlist-rating">
                            <star-rating
                                max="5"
                                singleSelect
                                @selectionChange="${(e: CustomEvent<{ rating: number }>) =>
                                    this.changeProperty('rating', e.detail.rating)}"
                            ></star-rating>
                        </div>
                    </div>
                    <div id="text-data-section">
                        <div id="playlist-name" class="property">
                            <div class="property-label">Name:</div>
                            <input
                                class="property-value"
                                .value="${this.newPlaylist.name}"
                                oninput="this.dispatchEvent(new Event('change'))"
                                @change="${(e: Event) =>
                                    this.changeProperty('name', (e.currentTarget as HTMLInputElement).value)}"
                            />
                        </div>
                        <div id="playlist-author" class="property">
                            <div class="property-label">Autor:</div>
                            <input
                                class="property-value"
                                .value="${this.newPlaylist.author ?? ''}"
                                oninput="this.dispatchEvent(new Event('change'))"
                                @change="${(e: Event) =>
                                    this.changeProperty('author', (e.currentTarget as HTMLInputElement).value)}"
                            />
                        </div>
                        <div id="playlist-genres" class="property">
                            <div class="property-label">Genres:</div>
                            <div class="property-value">
                                ${this.newPlaylist.genres.map(
                                    (genre) => html`<tag-label
                                        .text="${genre}"
                                        @removed="${() => this.removeGenre(genre)}"
                                    ></tag-label>`
                                )}
                                <tag-label
                                    createNew
                                    .autocomplete="${this.autocompleteGenres}"
                                    @tagCreated="${(e: CustomEvent<{ value: any }>) => this.addGenre(e.detail.value)}"
                                ></tag-label>
                            </div>
                        </div>
                        <div id="playlist-language" class="property">
                            <div class="property-label">Sprache:</div>
                            <div class="property-value">
                                <drop-down
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(Language),
                                        this.newPlaylist.language
                                    )}"
                                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                        this.changeProperty('language', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                        </div>
                        <div id="playlist-nation" class="property">
                            <div class="property-label">Nation:</div>
                            <div class="property-value">
                                <drop-down
                                    .options="${DropDownOption.createSimpleArray(
                                        Object.values(Language),
                                        this.newPlaylist.nation
                                    )}"
                                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                                        this.changeProperty('nation', e.detail.option.value)}"
                                ></drop-down>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="tracks-section" @dragover="${this.handleFilesDragOver}">
                    ${this.draggingFiles
                        ? html`<div
                              id="drag-info-overlay"
                              @dragleave="${(e: Event) => {
                                  e.preventDefault();
                                  this.draggingFiles = false;
                              }}"
                              @drop="${this.dropFiles}"
                          ></div>`
                        : ''}
                    <div id="tracks-actions">
                        <div
                            id="import-icon"
                            class="track-action"
                            icon="${Icons.Import}"
                            @click="${() => this.openImportDialog()}"
                        ></div>
                        <div
                            id="trash-icon"
                            class="track-action"
                            @click="${() => this.clearTracks()}"
                            icon="${Icons.Trash}"
                        ></div>
                    </div>
                    <ordered-list
                        id="tracks-container"
                        .items="${this.newPlaylist?.tracks ?? []}"
                        @items-changed="${(e: CustomEvent<any[]>) => this.changeProperty('tracks', e.detail)}"
                        propertyName="name"
                    ></ordered-list>
                </div>
            </div>
        </dialog-base>
    `;
}
