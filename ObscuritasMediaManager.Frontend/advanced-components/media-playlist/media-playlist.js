import { LitElement } from '../../exports.js';
import { randomizeArray } from '../../services/extensions/array.extensions.js';
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
        return this.displayedItems.slice(0, this.maxPlaylistItems);
    }

    constructor() {
        super();

        /** @type {string[]} */ this.items = [];
        /** @type {string[]} */ this.displayedItems = [];
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

        this.displayedItems = [...items];
        this.scrollToActive();
    }

    loadMoreItems() {
        if (this.displayedItems.length > this.maxPlaylistItems) this.maxPlaylistItems += 10;
        this.requestUpdate(undefined);
    }

    async randomizeOrder() {
        var currentItem = this.displayedItems[this.index];
        this.displayedItems = randomizeArray(this.displayedItems);
        this.index = this.displayedItems.indexOf(currentItem);
        this.maxPlaylistItems = this.index;
        while (this.maxPlaylistItems.toString().substr(-1) != '0') this.maxPlaylistItems++;
        this.requestUpdate(undefined);

        await this.scrollToActive();
    }

    restoreOrder() {
        this.displayedItems = [...this.items];
        this.requestUpdate(undefined);
    }

    notifyIndexChanged(index) {
        this.dispatchEvent(new CustomEvent('indexChanged', { detail: { index } }));
        this.index = index;
        this.requestUpdate(undefined);
        this.scrollToActive();
    }

    async scrollToActive() {
        await this.requestUpdate(undefined);
        /** @type {PaginatedScrolling} */ var playlistScrollContainer = this.shadowRoot.querySelector('#playlist-item-container');
        await playlistScrollContainer.requestUpdate(undefined);

        /** @type {HTMLElement} */ var child = this.shadowRoot.querySelector('.playlist-entry[active]');
        playlistScrollContainer.scrollToChild(child);
    }
}
