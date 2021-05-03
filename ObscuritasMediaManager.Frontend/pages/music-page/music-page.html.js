import { html } from '../../exports.js';
import { MusicPage } from './music-page.js';

/**
 * @param {MusicPage} musicPage
 */
export function renderMusicPage(musicPage) {
    return html`
        <page-layout>
            <div class="search-panel">
                <div class="language-filter"></div>
                <div class="instrument-filter"></div>
                <div class="mood-filter"></div>
                <div class="genre-filter"></div>
                <div class="instrumentation-filter"></div>
                <div class="participant-count-filter"></div>
            </div>
            <div class="result-options">
                <div class="import-files"></div>
                <div class="download-playlist"></div>
            </div>
            <div class="search-results"></div>
        </page-layout>
    `;
}
