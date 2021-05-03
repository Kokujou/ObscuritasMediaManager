import { LitElement } from '../../exports.js';
import { renderAudioTileStyles } from './audio-tile.css.js';
import { renderAudioTile } from './audio-tile.html.js';

export class AudioTile extends LitElement {
    static get styles() {
        return renderAudioTileStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.someProperty;
    }

    render() {
        return renderAudioTile(this);
    }
}
