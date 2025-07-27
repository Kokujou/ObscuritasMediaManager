import { html } from 'lit-element';
import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options';
import { SortingProperties } from '../../data/music-sorting-properties';
import { Session } from '../../data/session';
import { SortingDirections } from '../../data/sorting-directions';
import { changePage } from '../../extensions/url.extension';
import { LinkElement } from '../../native-components/link-element/link-element';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioService } from '../../services/audio-service';
import { ClipboardService } from '../../services/clipboard.service';
import { MusicPlaylistPage } from '../music-playlist-page/music-playlist-page';
import { MusicPage } from './music-page';

export function renderMusicPage(this: MusicPage) {
    return html`
        <page-layout>
            <div id="music-page">
                <div id="search-panel-container">
                    <music-filter
                        .filter="${this.filter}"
                        .sortingProperty="${this.sortingProperty}"
                        .sortingDirection="${this.sortingDirection}"
                        @filterChanged="${(e: CustomEvent<{ filter: MusicFilterOptions }>) => this.updateFilter(e.detail.filter)}"
                        @sortingUpdated="${(
                            e: CustomEvent<{ property: SortingProperties; direction: keyof typeof SortingDirections }>
                        ) => this.updateSorting(e.detail.property, e.detail.direction)}"
                        id="music-filter"
                    ></music-filter>
                    <div id="result-count-label">
                        ${this.filteredTracks.length} von ${Session.tracks.current().length} Musik-Tracks
                    </div>
                </div>
                <div id="result-options-container">
                    <div id="result-options">
                        <div class="option-section" id="import-section">
                            <a
                                id="import-files"
                                icon="${Icons.Import}"
                                @click="${() => this.importFolder()}"
                                tooltip="Tracks importieren"
                            ></a>
                            <a
                                id="create-song"
                                icon="${Icons.Plus}"
                                tooltip="Track hinzufügen"
                                @click="${() => changePage(MusicPlaylistPage, { createNew: true })}"
                            ></a>
                        </div>
                        <div class="option-section" id="import-section">
                            <a
                                id="cleanup-tracks"
                                icon="${Icons.Clean}"
                                @click="${() => this.cleanupTracks()}"
                                tooltip="Defekte Tracks bereinigen"
                            ></a>
                        </div>
                        <div class="option-section" id="playlist-section">
                            <a
                                id="add-to-playlist"
                                icon="${Icons.SavePlaylist}"
                                tooltip="Zu einer Playlist hinzufügen"
                                @click="${() => this.showPlaylistSelectionDialog()}"
                            ></a>
                            <a
                                id="create-playlist"
                                icon="${Icons.AddPlaylist}"
                                tooltip="Playlist erstellen"
                                @click="${() => this.showCreatePlaylistDialog()}"
                            ></a>
                            <a
                                id="play-playlist"
                                icon="${Icons.PlayPlaylist}"
                                tooltip="Ausgewählte Tracks abspielen"
                                @click="${() => this.playPlaylist()}"
                            ></a>
                        </div>

                        <div class="option-section">
                            <range-slider
                                @valueChanged="${(e: CustomEvent<{ value: string }>) =>
                                    this.changeVolume(Number.parseInt(e.detail.value))}"
                                step="1"
                                min="0"
                                max="100"
                                .value="${`${AudioService.volume * 100}`}"
                            >
                            </range-slider>
                        </div>

                        <div id="active-track-warning" ?invisible="${AudioService.paused}" @click="${() => this.jumpToActive()}">
                            Ein Track wird gerade abgespielt.&nbsp; <u> Klicken Sie hier </u> &nbsp;um zum aktiven Track zu
                            springen.
                        </div>
                    </div>
                </div>
                <paginated-scrolling
                    id="search-results-container"
                    scrollTopThreshold="50"
                    @scrollBottom="${() => this.loadNext()}"
                >
                    ${this.loading
                        ? html`<partial-loading></partial-loading>`
                        : html` <div id="search-results">
                              ${this.paginatedPlaylists.map(
                                  (playlist) =>
                                      html`
                                          <div class="audio-link-container">
                                              ${LinkElement.forPage(
                                                  MusicPlaylistPage,
                                                  { playlistId: playlist.id },
                                                  html`
                                                      <playlist-tile
                                                          .playlist="${playlist}"
                                                          @local-export="${() => this.exportPlaylist('local', playlist)}"
                                                          @global-export="${() => this.exportPlaylist('global', playlist)}"
                                                          @remove="${() => this.removePlaylist(playlist)}"
                                                      ></playlist-tile>
                                                  `
                                              )}
                                          </div>
                                      `
                              )}
                              ${this.paginatedTracks.map(
                                  (track) =>
                                      html`
                                          <div
                                              class="audio-link-container"
                                              @pointerdown="${(e: PointerEvent) => this.startSelectionModeTimer(track.hash, e)}"
                                              @pointerup="${(e: PointerEvent) => this.stopSelectionModeTimer(track.hash, e)}"
                                          >
                                              ${this.selectionMode
                                                  ? html`<input
                                                        type="checkbox"
                                                        class="audio-select"
                                                        ?checked="${this.selectedHashes.includes(track.hash)}"
                                                        @change="${(e: Event) =>
                                                            this.toggleTrackSelection(e.target as HTMLInputElement, track.hash)}"
                                                    />`
                                                  : ''}
                                              ${LinkElement.forPage(
                                                  MusicPlaylistPage,
                                                  { trackHash: track.hash },
                                                  html` <audio-tile
                                                      .track="${track}"
                                                      ?paused="${AudioService.paused ||
                                                      AudioService.currentTrackPath != track.path}"
                                                      @musicToggled="${() => this.toggleMusic(track)}"
                                                      @soft-delete="${() => this.softDeleteTrack(track)}"
                                                      @hard-delete="${() => this.hardDeleteTrack(track)}"
                                                      @restore="${() => this.undeleteTrack(track)}"
                                                      @clipboard="${() => ClipboardService.copyAudioToClipboard(track)}"
                                                  ></audio-tile>`,
                                                  { disabled: this.selectionModeTimer == null || this.selectionMode }
                                              )}
                                          </div>
                                      `
                              )}
                          </div>`}
                </paginated-scrolling>
            </div>
        </page-layout>
    `;
}
