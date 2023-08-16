import { LitElementBase } from '../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { session } from '../../data/session.js';
import { renderAudioTileBaseStyles } from './audio-tile-base.css.js';
import { renderAudioTileBase } from './audio-tile-base.html.js';

export class AudioTileBase extends LitElementBase {
    static get styles() {
        return renderAudioTileBaseStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            hoveredRating: { type: Number, reflect: true },
            paused: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {boolean} */ this.disabled = false;
        /** @type {ExtendedMusicModel} */ this.track = new ExtendedMusicModel();
        /** @type {Number} */ this.hoveredRating = 0;

        session.instruments.subscribe(() => this.requestUpdate(undefined));
    }

    render() {
        return renderAudioTileBase(this);
    }

    /**
     * @param {string} name
     * @param {any} detail
     * @param {Event} event
     */
    notifyEvent(name, detail, event = null) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (detail instanceof Event) {
            detail.stopPropagation();
            detail.preventDefault();
        }
        this.dispatchEvent(new CustomEvent(name, { detail }));
    }
}
