import { InstrumentTypes } from '../../data/enumerations/instrument-types.js';
import { Nations } from '../../data/enumerations/nations.js';
import { Participants } from '../../data/enumerations/participants.js';
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
                    <div id="search-panel">
                        <div id="search-heading">Suche</div>
                        <div id="language-filter" class="filter">
                            <div class="filter-heading">Sprache:</div>
                            <side-scroller>
                                ${Object.values(Nations).map(
                                    (type) =>
                                        html` <tri-value-checkbox class="icon-container" class="" ?allowThreeValues="${true}">
                                            <div class="inline-icon ${type}"></div>
                                        </tri-value-checkbox class="icon-container">`
                                )}
                            </side-scroller>
                        </div>
                        <div id="nation-filter" class="filter">
                            <div class="filter-heading">Herkunftsland:</div>
                            <side-scroller>
                                ${Object.values(Nations).map(
                                    (type) =>
                                        html` <tri-value-checkbox class="icon-container" ?allowThreeValues="${true}">
                                            <div class="inline-icon ${type}"></div>
                                        </tri-value-checkbox class="icon-container">`
                                )}
                            </side-scroller>
                            <div id="instrument-type-filter" class="filter">
                                <div class="filter-heading">Instrumenten-Typen:</div>
                                <side-scroller>
                                    ${Object.values(InstrumentTypes).map(
                                        (type) =>
                                            html` <tri-value-checkbox class="icon-container" ?allowThreeValues="${true}">
                                                <div class="inline-icon ${type}"></div>
                                            </tri-value-checkbox class="icon-container">`
                                    )}
                                </side-scroller>
                            </div>
                        </div>
                        <div id="instrument-filter" class="filter">
                            <div class="filter-heading">Instrumente:</div>
                        </div>
                        <div id="mood-filter" class="filter">
                            <div class="filter-heading">Stimmung:</div>
                        </div>
                        <div id="genre-filter" class="filter">
                            <div class="filter-heading">Genre:</div>
                        </div>
                        <div id="instrumentation-filter" class="filter">
                            <div class="filter-heading">Verteilung der Instrumente:</div>
                        </div>
                        <div id="participant-count-filter" class="filter">
                            <div class="filter-heading">Mitgliederzahl:</div>
                            <side-scroller>
                                ${Object.values(Participants).map(
                                    (type) =>
                                        html` <tri-value-checkbox class="icon-container" ?allowThreeValues="${true}">
                                            <div class="inline-icon ${type}"></div>
                                        </tri-value-checkbox class="icon-container">`
                                )}
                            </side-scroller>
                        </div>
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
                            <a id="play-playlist"></a>
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
                <paginated-scrolling id="search-results-container" scrollTopThreshold="50" @scrollBottom="${() => musicPage.loadNext()}">
                    <div id="search-results">
                        ${musicPage.filteredTracks.map(
                            (track) =>
                                html`
                                    <audio-tile
                                        .track="${track}"
                                        @musicToggled="${() => musicPage.toggleMusic(track)}"
                                        @edit="${() => {}}"
                                    ></audio-tile>
                                `
                        )}
                    </div>
                </paginated-scrolling>
            </div>
            <input type="file" id="folder-browser" webkitdirectory style="display:none" />
            <audio id="current-track" .volume="${musicPage.currentVolumne}" .src="${musicPage.currentTrack}"></audio>
        </page-layout>
    `;
}
