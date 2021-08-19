import { html } from '../../exports.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { AudioTile } from './audio-tile.js';

/**
 * @param {AudioTile} audioTile
 */
export function renderAudioTile(audioTile) {
    return html` <style>
            #tile-image {
                ${renderMaskImage(audioTile.image)};
            }
        </style>
        <div id="tile-container" @click="${() => audioTile.notifyMusicToggled()}" class="${audioTile.track.mood}">
            <div id="image-box">
                <div id="tile-image"></div>
                <div id="language-flags" class="icon-container">
                    <div id="nation-icon" class="inline-icon ${audioTile.track.nation}"></div>
                    <div id="language-icon" class="inline-icon ${audioTile.track.language}"></div>
                </div>
                <div id="instrumentation-icon" class="icon-container inline-icon">${audioTile.track.instrumentation}</div>
                <div id="participant-count-icon" class="icon-container inline-icon ${audioTile.track.participants}"></div>
                <div id="edit-icon-container" class="icon-container">
                    <div id="edit-icon" @click="${(e) => audioTile.notifyEditRequested(e)}" class="inline-icon"></div>
                </div>
            </div>
            <div id="tile-description">
                <div id="instrument-icons">${renderInstrumentIcons(audioTile)}</div>
                <div id="audio-title">${audioTile.track.name} ${audioTile.autorText} ${audioTile.sourceText}</div>
                <div id="audio-genre-section">${renderGenreTags(audioTile)}</div>
            </div>
        </div>`;
}

/**
 * @param {AudioTile} audioTile
 */
function renderGenreTags(audioTile) {
    return audioTile.track.genres.map((genre) => html` <tag-label .text="${genre}"></tag-label> `);
}

/**
 * @param {AudioTile} audioTile
 */
function renderInstrumentIcons(audioTile) {
    /** @type {string[]} */ var iconsToDisplay = [];
    var className = '';
    if (audioTile.track.instruments.length > 0) {
        iconsToDisplay = [];
        audioTile.track.instruments.forEach((instrument) => {
            if (!iconsToDisplay.includes(instrument.type)) iconsToDisplay.push(instrument.type);
        });
        className = 'instrument';
    } else {
        iconsToDisplay = audioTile.track.instruments.map((x) => x.name);
        className = 'instrument-type';
    }

    return iconsToDisplay.map((x) => html`<div class="inline-icon ${className} ${x}"></div>`);
}
