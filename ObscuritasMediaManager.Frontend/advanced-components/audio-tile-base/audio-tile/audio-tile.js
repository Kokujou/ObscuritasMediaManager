import { ExtendedMusicModel } from '../../../data/music.model.extended.js';
import { LitElement } from '../../../exports.js';
import { renderAudioTileStyles } from './audio-tile.css.js';
import { renderAudioTile } from './audio-tile.html.js';

export class AudioTile extends LitElement {
    static get styles() {
        return renderAudioTileStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            image: { type: String, reflect: true },
            paused: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {ExtendedMusicModel} */ this.track = new ExtendedMusicModel();
        /** @type {string} */ this.image;
        this.paused = true;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    notifyMusicToggled() {
        this.dispatchEvent(new CustomEvent('musicToggled'));
    }

    render() {
        return renderAudioTile(this);
    }
}
