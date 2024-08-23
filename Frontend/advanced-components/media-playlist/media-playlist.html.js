import { html } from '../../exports.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { MediaPlaylist } from './media-playlist.js';

/**
 * @param { MediaPlaylist } mediaPlaylist
 */
export function renderMediaPlaylist(mediaPlaylist) {
    return html`
        <div id="playlist-container">
            <div id="playlist-options">
                <div
                    class="playlist-button"
                    icon="${Icons.ShufflePlaylist}"
                    id="random-order-button"
                    @click="${() => mediaPlaylist.randomizeOrder()}"
                ></div>
                <div
                    class="playlist-button"
                    icon="${Icons.Revert}"
                    tooltip="Zurücksetzen"
                    id="reset-order-button"
                    @click="${() => mediaPlaylist.restoreOrder()}"
                ></div>
                <div class="playlist-button" id="remove-track-button"></div>
            </div>
            <paginated-scrolling
                scrollTopThreshold="20"
                id="playlist-item-container"
                @scrollBottom="${() => mediaPlaylist.loadMoreItems()}"
            >
                ${mediaPlaylist.paginatedItems.map(
                    (x, index) =>
                        html`
                            <div
                                class="playlist-entry"
                                ?active="${mediaPlaylist.index == index}"
                                @dblclick="${() => mediaPlaylist.notifyIndexChanged(index)}"
                            >
                                ${x}
                            </div>
                        `
                )}
            </paginated-scrolling>
        </div>
    `;
}
