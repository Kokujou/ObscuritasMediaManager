import { MusicModel } from '../../data/music.model.js';
import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { renderAudioTileBaseStyles } from './audio-tile-base.css.js';
import { renderAudioTileBase } from './audio-tile-base.html.js';

export class AudioTileBase extends LitElement {
    static get styles() {
        return renderAudioTileBaseStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            hoveredRating: { type: Number, reflect: true },
            paused: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {MusicModel} */ this.track = new MusicModel();
        /** @type {Number} */ this.hoveredRating = 0;

        session.instruments.subscribe(() => this.requestUpdate(undefined));
    }

    render() {
        return renderAudioTileBase(this);
    }

    /**
     * @param {string} name
     * @param {any} detail
     */
    notifyEvent(name, detail) {
        this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    }
}
