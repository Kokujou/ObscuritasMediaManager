import { LitElement } from '../../exports.js';
import { renderWebcomponentTemplateStyles as renderImageTileStyles } from './image-tile.css.js';
import { renderWebcomponentTemplate as renderImageTile } from './image-tile.html.js';

export class ImageTile extends LitElement {
    static get styles() {
        return renderImageTileStyles();
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
            src: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {String} */ this.caption = '';
        /** @type {String} */ this.src = '';
    }

    render() {
        return renderImageTile(this);
    }
}
