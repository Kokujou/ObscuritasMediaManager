import { html } from 'lit';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { MediaPlaylist } from './media-playlist';

export function renderMediaPlaylist(this: MediaPlaylist) {
    return html`
        <div id="playlist-container">
            <div id="playlist-options">
                <div
                    class="playlist-button"
                    icon="${Icons.ShufflePlaylist}"
                    id="random-order-button"
                    @click="${() => this.randomizeOrder()}"
                ></div>
                <div
                    class="playlist-button"
                    icon="${Icons.Revert}"
                    tooltip="Zurücksetzen"
                    id="reset-order-button"
                    @click="${() => this.restoreOrder()}"
                ></div>
                <div class="playlist-button" id="remove-track-button"></div>
            </div>
            <paginated-scrolling
                scrollTopThreshold="20"
                id="playlist-item-container"
                @scrollBottom="${() => this.loadMoreItems()}"
            >
                ${this.paginatedItems.map(
                    (x, index) =>
                        html`
                            <div
                                class="playlist-entry"
                                ?active="${this.index == index}"
                                @dblclick="${() => this.notifyIndexChanged(index)}"
                            >
                                ${x}
                            </div>
                        `
                )}
            </paginated-scrolling>
        </div>
    `;
}
