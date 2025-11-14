import { html } from 'lit';
import { ImageTile } from './image-tile';

export function renderWebcomponentTemplate(this: ImageTile) {
    return html`
        <div id="tile-container">
            <div id="image-tile">
                <div id="image-content" style="background-image: url(${this.src})"></div>
                <div id="image-text">${this.caption}</div>
            </div>
        </div>
    `;
}
