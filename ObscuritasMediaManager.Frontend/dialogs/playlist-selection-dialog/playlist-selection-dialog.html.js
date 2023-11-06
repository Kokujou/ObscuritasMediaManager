import { html } from '../../exports.js';
import { MusicPlaylistPage } from '../../pages/music-playlist-page/music-playlist-page.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { getPageName } from '../../services/extensions/url.extension.js';
import { PlaylistSelectionDialog } from './playlist-selection-dialog.js';

/**
 * @param { PlaylistSelectionDialog } dialog
 */
export function renderPlaylistSelectionDialog(dialog) {
    return html`
        <dialog-base
            caption="Playlists"
            acceptActionText="Speichern"
            declineActionText="Abbrechen"
            ?canAccept="${!!dialog.selectedPlaylist}"
            showBorder
        >
            <table>
                <thead>
                    <tr class="head-row">
                        <th></th>
                        <th class="name-column">Name</th>
                        <th>Autor</th>
                        <th>Language</th>
                        <th>Nation</th>
                        <th class="rating-column">Rating</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${dialog.playlists.map(
                        (playlist) => html`<tr
                            ?selected="${playlist?.id == dialog.selectedPlaylist?.id}"
                            @click="${() => {
                                dialog.selectedPlaylist = playlist;
                                dialog.requestFullUpdate();
                            }}"
                        >
                            <td class="name-column">${playlist.image}</td>
                            <td>${playlist.name}</td>
                            <td>${playlist.author}</td>
                            <td>${playlist.language}</td>
                            <td>${playlist.nation}</td>
                            <td class="rating-column">
                                <star-rating max="5" .values="${Array.from(Array(playlist.rating).keys())}"></star-rating>
                            </td>
                            <td>
                                <div
                                    class="popup-icon"
                                    icon="${Icons.Popup}"
                                    @click="${
                                        /** @param {Event} e */ (e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open(`./?guid=${playlist.id}#${getPageName(MusicPlaylistPage)}`, '_blank');
                                        }
                                    }"
                                ></div>
                            </td>
                        </tr>`
                    )}
                </tbody>
            </table>
        </dialog-base>
    `;
}
