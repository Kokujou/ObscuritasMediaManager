import { MusicModel } from '../../../data/music.model.js';
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
        /** @type {MusicModel} */ this.track = new MusicModel();
        /** @type {string} */ this.image;
        this.paused = true;
    }
    notifyMusicToggled() {
        this.dispatchEvent(new CustomEvent('musicToggled'));
    }

    render() {
        return renderAudioTile(this);
    }
}
