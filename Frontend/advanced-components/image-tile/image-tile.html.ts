import { html } from 'lit-element';
import { ImageTile } from './image-tile';

export function renderWebcomponentTemplate(imageTile: ImageTile) {
    return html`
        <div id="tile-container">
            <div id="image-tile">
                <div id="image-content" style="background-image: url(${imageTile.src})"></div>
                <div id="image-text">${imageTile.caption}</div>
            </div>
        </div>
    `;
}
