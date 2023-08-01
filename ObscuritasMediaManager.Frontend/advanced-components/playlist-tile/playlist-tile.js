import { LitElementBase } from '../../data/lit-element-base.js';
import { PlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { renderPlaylistTileStyles } from './playlist-tile.css.js';
import { renderPlaylistTile } from './playlist-tile.html.js';

export class PlaylistTile extends LitElementBase {
    static get styles() {
        return renderPlaylistTileStyles();
    }

    static get properties() {
        return {
            playlist: { type: Object, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {PlaylistModel} */ this.playlist;
    }

    render() {
        return renderPlaylistTile(this);
    }
}
