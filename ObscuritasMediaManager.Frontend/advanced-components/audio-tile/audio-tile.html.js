import { html } from '../../exports.js';
import { AudioTile } from './audio-tile.js';

/**
 * @param {AudioTile} audioTile
 */
export function renderAudioTile(audioTile) {
    return html`<div class="tile-container">
        <div class="image-box">
            <div class="tile-image"></div>
            <div class="language-flag"></div>
            <div class="instrument-icons"></div>
        </div>
        <div class="tile-description"></div>
    </div>`;
}
