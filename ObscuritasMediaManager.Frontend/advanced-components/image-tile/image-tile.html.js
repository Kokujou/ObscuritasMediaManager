import { html } from '../../exports.js';
import { ImageTile } from './image-tile.js';

/**
 * @param {ImageTile} imageTile
 */
export function renderWebcomponentTemplate(imageTile) {
    return html`
        <div class="tile-container">
            <div class="image-tile">
                <div class="image-content" style="background-image: url(${imageTile.src})"></div>
                <div class="image-text">${imageTile.caption}</div>
            </div>
        </div>
    `;
}
