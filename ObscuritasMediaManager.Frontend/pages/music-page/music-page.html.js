import { Pages } from '../../data/pages.js';
import { html } from '../../exports.js';
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
                            <a id="import-files" @click="${() => musicPage.importFolder()}"></a>
                            <a id="create-song"></a>
                        </div>
                        <div class="option-section" id="import-section">
                            <a id="cleanup-tracks" @click="${() => musicPage.cleanupTracks()}"></a>
                        </div>
                        <div class="option-section" id="playlist-section">
                            <a id="save-playlist"></a>
                            <a id="add-to-playlist"></a>
                            <a id="play-playlist" @click="${() => musicPage.playPlaylist()}"></a>
                            <a id="browse-playlists"></a>
                        </div>

                        <div class="option-section">
                            <a id="download-playlist"></a>
                        </div>

                        <div class="option-section">
                            <range-slider
                                @valueChanged="${(e) => musicPage.changeVolume(e.detail.value)}"
                                step="1"
                                min="0"
                                max="100"
                                .value="${`${musicPage.currentVolumne * 100}`}"
                            >
                            </range-slider>
                        </div>
                        <div
                            id="active-track-warning"
                            ?invisible="${musicPage.isPaused}"
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
                                                  .hash="${Pages.musicPlaylist.routes[0]}"
                                                  .search="track=${track.hash}"
                                                  ?disabled="${musicPage.selectionModeTimer == null || musicPage.selectionMode}"
                                                  @pointerdown="${(e) => musicPage.startSelectionModeTimer(track.hash)}"
                                                  @pointerup="${(e) => musicPage.stopSelectionModeTimer(track.hash)}"
                                              >
                                                  <audio-tile
                                                      .track="${track}"
                                                      .image="${musicPage.getTrackIcon(track)}"
                                                      ?paused="${musicPage.isPaused ||
                                                      !musicPage.currentTrackPath.includes(encodeURIComponent(track.path))}"
                                                      @musicToggled="${() => musicPage.toggleMusic(track)}"
                                                  ></audio-tile>
                                              </link-element>
                                          </div>
                                      `
                              )}
                          </div>`}
                </paginated-scrolling>
            </div>
            <audio id="current-track" .volume="${musicPage.currentVolumne}" .src="${musicPage.currentTrackPath}"></audio>
        </page-layout>
    `;
}
