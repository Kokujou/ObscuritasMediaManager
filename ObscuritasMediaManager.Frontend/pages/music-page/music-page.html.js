import { html } from '../../exports.js';
import { MusicPage } from './music-page.js';

/**
 * @param {MusicPage} musicPage
 */
export function renderMusicPage(musicPage) {
    return html`
        <page-layout>
            <div id="music-page">
                <div id="search-panel">
                    <div id="search-heading">Suche</div>
                    <div id="language-filter">test</div>
                    <div id="instrument-filter"></div>
                    <div id="mood-filter"></div>
                    <div id="genre-filter"></div>
                    <div id="instrumentation-filter"></div>
                    <div id="participant-count-filter"></div>
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
