import { html } from '../../exports.js';
import { ImageTile } from './image-tile.js';

/**
 * @param {ImageTile} imageTile
 */
export function renderWebcomponentTemplate(imageTile) {
    return html`
        <div id="tile-container">
            <div id="image-tile">
                <div id="image-content" style="background-image: url(${imageTile.src})"></div>
                <div id="image-text">${imageTile.caption}</div>
            </div>
        </div>
    `;
}
