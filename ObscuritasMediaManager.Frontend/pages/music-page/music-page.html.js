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
                        @filterChanged="${(e) => musicPage.updateFilter(e.detail.filter)}"
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
                    </div>
                </div>
                <paginated-scrolling
                    id="search-results-container"
                    scrollTopThreshold="50"
                    @scrollBottom="${() => musicPage.loadNext()}"
                >
                    <div id="search-results">
                        ${musicPage.paginatedTracks.map(
                            (track) =>
                                html`
                                    <audio-tile
                                        .track="${track}"
                                        .image="${musicPage.getTrackIcon(track)}"
                                        ?paused="${musicPage.isPaused || !musicPage.currentTrackPath.includes(track.path)}"
                                        @toggle="${() => musicPage.toggleMusic(track)}"
                                        @click="${() => musicPage.editTrack(track)}"
                                    ></audio-tile>
                                `
                        )}
                    </div>
                </paginated-scrolling>
            </div>
            <audio id="current-track" .volume="${musicPage.currentVolumne}" .src="${musicPage.currentTrackPath}"></audio>
        </page-layout>
    `;
}
