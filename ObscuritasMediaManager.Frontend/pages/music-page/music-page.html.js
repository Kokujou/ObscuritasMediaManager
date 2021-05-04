import { html } from '../../exports.js';
import { MusicPage } from './music-page.js';

/**
 * @param {MusicPage} musicPage
 */
export function renderMusicPage(musicPage) {
    return html`
        <page-layout>
            <div id="search-panel">
                <div id="language-filter"></div>
                <div id="instrument-filter"></div>
                <div id="mood-filter"></div>
                <div id="genre-filter"></div>
                <div id="instrumentation-filter"></div>
                <div id="participant-count-filter"></div>
            </div>
            <div id="result-options">
                <div id="import-files"></div>
                <div id="download-playlist"></div>
            </div>
            <div id="search-results"></div>
        </page-layout>
    `;
}
