import { LitElement } from '../../exports.js';
import { renderVideoPlayerStyles } from './video-player-popup.css.js';
import { renderVideoPlayer } from './video-player-popup.html.js';

export class VideoPlayerPopup extends LitElement {
    static get styles() {
        return renderVideoPlayerStyles();
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
        return renderVideoPlayer(this);
    }
}
