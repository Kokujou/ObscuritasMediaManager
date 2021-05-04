import { html } from '../../exports.js';
import { AudioTile } from './audio-tile.js';

/**
 * @param {AudioTile} audioTile
 */
export function renderAudioTile(audioTile) {
    return html`<div id="tile-container">
        <div id="image-box">
            <div id="tile-image"></div>
            <div id="language-flag"></div>
            <div id="instrument-icons"></div>
        </div>
        <div id="tile-description"></div>
    </div>`;
}
