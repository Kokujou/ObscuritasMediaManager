import { MusicModel } from '../../data/music.model.js';
import { LitElement } from '../../exports.js';
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
        };
    }

    constructor() {
        super();
        /** @type {MusicModel} */ this.track = new MusicModel();
        /** @type {string} */ this.image;
    }

    get autorText() {
        if (this.track.author) return `- ${this.track.author}`;
        return '';
    }
    get sourceText() {
        if (this.track.source) return `(${this.track.source})`;
        return '';
    }

    notifyEditRequested() {
        this.dispatchEvent(new CustomEvent('edit'));
    }

    notifyMusicToggled() {
        this.dispatchEvent(new CustomEvent('musicToggled'));
    }

    render() {
        return renderAudioTile(this);
    }
}
