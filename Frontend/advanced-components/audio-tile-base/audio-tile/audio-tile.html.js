import { getMoodFontColor, MoodColors } from '../../../data/enumerations/mood.js';
import { html } from '../../../exports.js';
import { Mood } from '../../../obscuritas-media-manager-backend-client.js';
import { AudioTile } from './audio-tile.js';

/**
 * @param {AudioTile} audioTile
 */
export function renderAudioTile(audioTile) {
    return html` <style>
            :host {
                --primary-color: ${MoodColors[audioTile.track.mood1]};
                --secondary-color: ${MoodColors[
                    audioTile.track.mood2 == Mood.Unset ? audioTile.track.mood1 : audioTile.track.mood2
                ]};
                --font-color: ${getMoodFontColor(audioTile.track.mood1)};
            }
        </style>
        <div id="tile-container">
            <audio-tile-base
                .track="${audioTile.track}"
                ?paused="${audioTile.paused}"
                @imageClicked="${() => audioTile.notifyMusicToggled()}"
            ></audio-tile-base>
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
    return html`${iconsToDisplay.map((x) => html`<div class="inline-icon" instrument-type="${x}"></div>`)}`;
}
