import { LitElement } from '../../exports.js';
import { PaginatedScrolling } from '../paginated-scrolling/paginated-scrolling.js';
import { renderMediaPlaylistStyles } from './media-playlist.css.js';
import { renderMediaPlaylist } from './media-playlist.html.js';

export class MediaPlaylist extends LitElement {
    static get styles() {
        return renderMediaPlaylistStyles();
    }

    static get properties() {
        return {
            items: { type: Array, reflect: true },
            index: { type: Number, reflect: true },
        };
    }

    get paginatedItems() {
        return this.items.slice(0, this.maxPlaylistItems);
    }

    constructor() {
        super();

        /** @type {string[]} */ this.items = [];
        /** @type {string[]} */ this.originalItems = [];
        /** @type {number} */ this.index = 0;

        /** @type {number} */ this.maxPlaylistItems = 20;
    }

    render() {
        return renderMediaPlaylist(this);
    }

    /**
     * @param {Map<any, any>} _changedProperties
     */
    updated(_changedProperties) {
        super.updated(_changedProperties);

        if (!_changedProperties.has('items')) return;

        var items = _changedProperties.get('items');
        if (!items) return;
        this.originalItems = [...items];
        if (_changedProperties.has('index')) this.scrollToActive();
    }

    loadMoreItems() {
        if (this.items.length > this.maxPlaylistItems) this.maxPlaylistItems += 10;
        this.requestUpdate(undefined);
    }

    async randomizeOrder() {
        this.dispatchEvent(new CustomEvent('randomize'));
    }

    restoreOrder() {
        this.items = [...this.originalItems];
        this.requestUpdate(undefined);
    }

    notifyIndexChanged(index) {
        this.dispatchEvent(new CustomEvent('indexChanged', { detail: { index } }));
        this.index = index;
        this.requestUpdate(undefined);
        this.scrollToActive();
    }

    async scrollToActive() {
        this.maxPlaylistItems = this.index + 1;
        while (this.maxPlaylistItems.toString().at(-1) != '0') this.maxPlaylistItems++;
        await this.requestUpdate(undefined);
        /** @type {PaginatedScrolling} */ var playlistScrollContainer = this.shadowRoot.querySelector('#playlist-item-container');
        await playlistScrollContainer.requestUpdate(undefined);

        setTimeout(() => {
            /** @type {HTMLElement} */ var child = this.shadowRoot.querySelector('.playlist-entry[active]');
            playlistScrollContainer.scrollToChild(child);
        }, 100);
    }
}
