import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PaginatedScrolling } from '../paginated-scrolling/paginated-scrolling';
import { renderMediaPlaylistStyles } from './media-playlist.css';
import { renderMediaPlaylist } from './media-playlist.html';

@customElement('media-playlist')
export class MediaPlaylist extends LitElementBase {
    static override get styles() {
        return renderMediaPlaylistStyles();
    }

    get paginatedItems() {
        return this.items.slice(0, this.maxPlaylistItems);
    }

    @property({ type: Array }) protected items: string[] = [];
    @property({ type: Number }) protected index = 0;

    protected originalItems: string[] = [];
    protected maxPlaylistItems = 20;

    override render() {
        return renderMediaPlaylist.call(this);
    }

    updated(_changedProperties: Map<any, any>) {
        super.updated(_changedProperties);

        if (!_changedProperties.has('items')) return;

        var items = _changedProperties.get('items');
        if (!items) return;
        this.originalItems = [...items];
        if (_changedProperties.has('index')) this.scrollToActive();
    }

    loadMoreItems() {
        if (this.items.length > this.maxPlaylistItems) this.maxPlaylistItems += 10;
        this.requestFullUpdate();
    }

    async randomizeOrder() {
        this.dispatchEvent(new CustomEvent('randomize'));
    }

    restoreOrder() {
        this.items = [...this.originalItems];
        this.requestFullUpdate();
    }

    notifyIndexChanged(index: number) {
        this.dispatchEvent(new CustomEvent('indexChanged', { detail: { index } }));
        this.index = index;
        this.requestFullUpdate();
        this.scrollToActive();
    }

    async scrollToActive() {
        this.maxPlaylistItems = this.index + 1;
        while (this.maxPlaylistItems.toString().at(-1) != '0') this.maxPlaylistItems++;
        await this.requestFullUpdate();
        var playlistScrollContainer = this.shadowRoot?.querySelector('#playlist-item-container') as PaginatedScrolling | null;
        await playlistScrollContainer?.requestFullUpdate();

        setTimeout(() => {
            /** @type {HTMLElement | null | undefined} */ var child = this.shadowRoot?.querySelector('.playlist-entry[active]');
            if (!child) return;
            playlistScrollContainer?.scrollToChild(child);
        }, 100);
    }
}
