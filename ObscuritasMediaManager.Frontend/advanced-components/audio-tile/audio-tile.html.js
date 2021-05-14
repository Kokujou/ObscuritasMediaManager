import { html } from '../../exports.js';
import { AudioTile } from './audio-tile.js';

/**
 * @param {AudioTile} audioTile
 */
export function renderAudioTile(audioTile) {
    return html` <div id="tile-container" class="${audioTile.mood}">
        <div id="image-box">
            <div id="tile-image"></div>
            <div id="language-flags" class="icon-container">
                <div id="nation-icon" class="inline-icon ${audioTile.nation}"></div>
                <div id="language-icon" class="inline-icon ${audioTile.language}"></div>
            </div>
            <div id="instrumentation-icon" class="icon-container"></div>
            <div id="participant-count-icon" class="icon-container ${audioTile.participantCount}"></div>
        </div>
        <div id="tile-description">
            <div id="instrument-icons">${renderInstrumentIcons(audioTile)}</div>
            <div id="audio-title">${audioTile.caption} ${audioTile.autorText} ${audioTile.sourceText}</div>
            <div id="audio-genre-section"></div>
        </div>
    </div>`;
}

/**
 * @param {AudioTile} audioTile
 */
function renderInstrumentIcons(audioTile) {
    /** @type {string[]} */ var iconsToDisplay = [];
    var className = '';
    if (audioTile.instruments.length > 7) {
        iconsToDisplay = audioTile.instrumentTypes;
        className = 'instrument';
    } else {
        iconsToDisplay = audioTile.instruments;
        className = 'instrument-type';
    }

    return iconsToDisplay.map((x) => html`<div class="inline-icon ${className} ${x}"></div>`);
}
