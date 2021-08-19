import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { renderMediaPlaylist } from './media-playlist.html.js';
import { renderMediaPlaylistStyles } from './media-playlist.css.js';

export class MediaPlaylist extends LitElement {
    static get styles() {
        return renderMediaPlaylistStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {string} */ this.someProperty;

        session.resources.subscribe(() => this.requestUpdate(undefined));
    }

    render() {
        return renderMediaPlaylist(this);
    }
}
