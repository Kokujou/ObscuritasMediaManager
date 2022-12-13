import { LitElementBase } from '../../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../../data/music.model.extended.js';
import { renderAudioTileStyles } from './audio-tile.css.js';
import { renderAudioTile } from './audio-tile.html.js';

export class AudioTile extends LitElementBase {
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
        this.dispatchCustomEvent('musicToggled');
    }

    render() {
        return renderAudioTile(this);
    }
}
