import { html } from 'lit-element';
import { Session } from '../../data/session';
import { LinkElement } from '../../native-components/link-element/link-element';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioService } from '../../services/audio-service';
import { ClipboardService } from '../../services/clipboard.service';
import { changePage } from '../../services/extensions/url.extension';
import { MusicPlaylistPage } from '../music-playlist-page/music-playlist-page';
import { MusicPage } from './music-page';

/**
 * @param {MusicPage} musicPage
 */
export function renderMusicPage(musicPage) {
    return html`
        <page-layout>
            <div id="music-page">
                <div id="search-panel-container">
                    <music-filter
                        .filter="${musicPage.filter}"
                        .sortingProperty="${musicPage.sortingProperty}"
                        .sortingDirection="${musicPage.sortingDirection}"
                        @filterChanged="${(e) => musicPage.updateFilter(e.detail.filter)}"
                        @sortingUpdated="${(e) => musicPage.updateSorting(e.detail.property, e.detail.direction)}"
                        id="music-filter"
                    ></music-filter>
                    <div id="result-count-label">
                        ${musicPage.filteredTracks.length} von ${Session.tracks.current().length} Musik-Tracks
                    </div>
                </div>
                <div id="result-options-container">
                    <div id="result-options">
                        <div class="option-section" id="import-section">
                            <a
                                id="import-files"
                                icon="${Icons.Import}"
                                @click="${() => musicPage.importFolder()}"
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
                                @click="${() => musicPage.cleanupTracks()}"
                                tooltip="Defekte Tracks bereinigen"
                            ></a>
                        </div>
                        <div class="option-section" id="playlist-section">
                            <a
                                id="add-to-playlist"
                                icon="${Icons.SavePlaylist}"
                                tooltip="Zu einer Playlist hinzufügen"
                                @click="${() => musicPage.showPlaylistSelectionDialog()}"
                            ></a>
                            <a
                                id="create-playlist"
                                icon="${Icons.AddPlaylist}"
                                tooltip="Playlist erstellen"
                                @click="${() => musicPage.showCreatePlaylistDialog()}"
                            ></a>
                            <a
                                id="play-playlist"
                                icon="${Icons.PlayPlaylist}"
                                tooltip="Ausgewählte Tracks abspielen"
                                @click="${() => musicPage.playPlaylist()}"
                            ></a>
                        </div>

                        <div class="option-section">
                            <range-slider
                                @valueChanged="${(e) => musicPage.changeVolume(e.detail.value)}"
                                step="1"
                                min="0"
                                max="100"
                                .value="${`${AudioService.volume * 100}`}"
                            >
                            </range-slider>
                        </div>

                        <div
                            id="active-track-warning"
                            ?invisible="${AudioService.paused}"
                            @click="${() => musicPage.jumpToActive()}"
                        >
                            Ein Track wird gerade abgespielt.&nbsp; <u> Klicken Sie hier </u> &nbsp;um zum aktiven Track zu
                            springen.
                        </div>
                    </div>
                </div>
                <paginated-scrolling
                    id="search-results-container"
                    scrollTopThreshold="50"
                    @scrollBottom="${() => musicPage.loadNext()}"
                >
                    ${musicPage.loading
                        ? html`<partial-loading></partial-loading>`
                        : html` <div id="search-results">
                              ${musicPage.paginatedPlaylists.map(
                                  (playlist) =>
                                      html`
                                          <div class="audio-link-container">
                                              ${LinkElement.forPage(
                                                  MusicPlaylistPage,
                                                  { playlistId: playlist.id },
                                                  html`
                                                      <playlist-tile
                                                          .playlist="${playlist}"
                                                          @local-export="${() => musicPage.exportPlaylist('local', playlist)}"
                                                          @global-export="${() => musicPage.exportPlaylist('global', playlist)}"
                                                          @remove="${() => musicPage.removePlaylist(playlist)}"
                                                      ></playlist-tile>
                                                  `
                                              )}
                                          </div>
                                      `
                              )}
                              ${musicPage.paginatedTracks.map(
                                  (track) =>
                                      html`
                                          <div
                                              class="audio-link-container"
                                              @pointerdown="${(e) => musicPage.startSelectionModeTimer(track.hash, e)}"
                                              @pointerup="${(e) => musicPage.stopSelectionModeTimer(track.hash, e)}"
                                          >
                                              ${musicPage.selectionMode
                                                  ? html`<input
                                                        type="checkbox"
                                                        class="audio-select"
                                                        ?checked="${musicPage.selectedHashes.includes(track.hash)}"
                                                        @change="${(e) => musicPage.toggleTrackSelection(e.target, track.hash)}"
                                                    />`
                                                  : ''}
                                              ${LinkElement.forPage(
                                                  MusicPlaylistPage,
                                                  { trackHash: track.hash },
                                                  html` <audio-tile
                                                      .track="${track}"
                                                      ?paused="${AudioService.paused ||
                                                      AudioService.currentTrackPath != track.path}"
                                                      @musicToggled="${() => musicPage.toggleMusic(track)}"
                                                      @soft-delete="${() => musicPage.softDeleteTrack(track)}"
                                                      @hard-delete="${() => musicPage.hardDeleteTrack(track)}"
                                                      @restore="${() => musicPage.undeleteTrack(track)}"
                                                      @clipboard="${() => ClipboardService.copyAudioToClipboard(track)}"
                                                  ></audio-tile>`,
                                                  { disabled: musicPage.selectionModeTimer == null || musicPage.selectionMode }
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
