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
                        <div id="language-filter">
                            ${Object.values(Nations).map(
                                (type) =>
                                    html` <tri-value-checkbox ?allowThreeValues="${true}">
                                        <div class="inline-icon ${type}"></div>
                                    </tri-value-checkbox>`
                            )}
                        </div>
                        <div id="nation-filter">
                            ${Object.values(Nations).map(
                                (type) =>
                                    html` <tri-value-checkbox ?allowThreeValues="${true}">
                                        <div class="inline-icon ${type}"></div>
                                    </tri-value-checkbox>`
                            )}
                        </div>
                        <div id="instrument-filter"></div>
                        <div id="instrument-type-filter">
                            ${Object.values(InstrumentTypes).map(
                                (type) =>
                                    html` <tri-value-checkbox ?allowThreeValues="${true}">
                                        <div class="inline-icon ${type}"></div>
                                    </tri-value-checkbox>`
                            )}
                        </div>
                        <div id="mood-filter"></div>
                        <div id="genre-filter"></div>
                        <div id="instrumentation-filter"></div>
                        <div id="participant-count-filter">
                            ${Object.values(Participants).map(
                                (type) =>
                                    html` <tri-value-checkbox ?allowThreeValues="${true}">
                                        <div class="inline-icon ${type}"></div>
                                    </tri-value-checkbox>`
                            )}
                        </div>
                    </div>
                </div>
                <div id="result-options-container">
                    <div id="result-options">
                        <div class="option-section" id="import-section">
                            <a id="import-files"></a>
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
                    </div>
                </div>
                <div id="search-results"></div>
            </div>
        </page-layout>
    `;
}
