import { html } from '../../../exports.js';
import { renderMaskImage } from '../../../services/extensions/style.extensions.js';
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
            <audio-tile-base .track="${audioTile.track}" ?paused="${audioTile.paused}"></audio-tile-base>
            <div id="tile-description">
                <div id="instrument-icons">${renderInstrumentIcons(audioTile)}</div>
                <div id="audio-title">${audioTile.track.displayName}</div>
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
    var iconsToDisplay = audioTile.track.instrumentTypes;
    return html`${iconsToDisplay.map((x) => html`<div class="inline-icon instrument-type ${x}"></div>`)}`;
}
