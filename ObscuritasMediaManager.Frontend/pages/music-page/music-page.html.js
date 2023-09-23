import { Session } from '../../data/session.js';
import { html } from '../../exports.js';
import { getPageName } from '../../services/extensions/url.extension.js';
import { MusicPlaylistPage } from '../music-playlist-page/music-playlist-page.js';
import { MusicPage } from './music-page.js';

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
                        ${musicPage.filteredTracks.length} von ${musicPage.musicTracks.length} Musik-Tracks
                    </div>
                </div>
                <div id="result-options-container">
                    <div id="result-options">
                        <div class="option-section" id="import-section">
                            <a id="import-files" @click="${() => musicPage.importFolder()}" tooltip="Tracks importieren"></a>
                            <a id="create-song"></a>
                        </div>
                        <div class="option-section" id="import-section">
                            <a
                                id="cleanup-tracks"
                                @click="${() => musicPage.cleanupTracks()}"
                                tooltip="Defekte Tracks bereinigen"
                            ></a>
                        </div>
                        <div class="option-section" id="playlist-section">
                            <a
                                id="add-to-playlist"
                                tooltip="Zu einer Playlist hinzufügen"
                                @click="${() => musicPage.showPlaylistSelectionDialog()}"
                            ></a>
                            <a
                                id="create-playlist"
                                tooltip="Playlist erstellen"
                                @click="${() => musicPage.showCreatePlaylistDialog()}"
                            ></a>
                            <a
                                id="play-playlist"
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
                                .value="${`${Session.Audio.volume * 100}`}"
                            >
                            </range-slider>
                        </div>

                        <div
                            id="active-track-warning"
                            ?invisible="${Session.Audio.paused}"
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
                                              <link-element
                                                  class="audio-tile-link"
                                                  .hash="${getPageName(MusicPlaylistPage)}"
                                                  .search="guid=${playlist.id}"
                                              >
                                                  <playlist-tile
                                                      .playlist="${playlist}"
                                                      @local-export="${() => musicPage.exportPlaylist('local', playlist)}"
                                                      @global-export="${() => musicPage.exportPlaylist('global', playlist)}"
                                                      @remove="${() => musicPage.removePlaylist(playlist)}"
                                                  ></playlist-tile>
                                              </link-element>
                                          </div>
                                      `
                              )}
                              ${musicPage.paginatedTracks.map(
                                  (track) =>
                                      html`
                                          <div class="audio-link-container">
                                              ${musicPage.selectionMode
                                                  ? html`<input
                                                        type="checkbox"
                                                        class="audio-select"
                                                        ?checked="${musicPage.selectedHashes.includes(track.hash)}"
                                                        @change="${(e) => musicPage.toggleTrackSelection(e.target, track.hash)}"
                                                    />`
                                                  : ''}
                                              <link-element
                                                  class="audio-tile-link"
                                                  .hash="${getPageName(MusicPlaylistPage)}"
                                                  .search="track=${track.hash}"
                                                  ?disabled="${musicPage.selectionModeTimer == null || musicPage.selectionMode}"
                                                  @pointerdown="${(e) => musicPage.startSelectionModeTimer(track.hash, e)}"
                                                  @pointerup="${(e) => musicPage.stopSelectionModeTimer(track.hash, e)}"
                                              >
                                                  <audio-tile
                                                      .track="${track}"
                                                      .visualizationData="${musicPage.currentTrack?.path == track.path
                                                          ? Session.Audio.visualizationData
                                                          : null}"
                                                      ?paused="${Session.Audio.paused ||
                                                      musicPage.currentTrack.path != track.path}"
                                                      @musicToggled="${() => musicPage.toggleMusic(track)}"
                                                      @soft-delete="${() => musicPage.softDeleteTrack(track)}"
                                                      @hard-delete="${() => musicPage.hardDeleteTrack(track)}"
                                                      @restore="${() => musicPage.undeleteTrack(track)}"
                                                      @popup="${() =>
                                                          window.open(musicPage.getTrackPath('global', track), '_blank')}"
                                                  ></audio-tile>
                                              </link-element>
                                          </div>
                                      `
                              )}
                          </div>`}
                </paginated-scrolling>
            </div>
        </page-layout>
    `;
}
