import { html } from '../../exports.js';
import { playlistIcon } from '../../resources/icons/playlist-icons/playlist-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { PlaylistTile } from './playlist-tile.js';

/**
 * @param { PlaylistTile } playlistTile
 */
export function renderPlaylistTile(playlistTile) {
    return html`
        <style>
            :host {
                --primary-color: black;
                --secondary-color: white;
                --font-color: white;
            }

            #playlist-image {
                ${renderMaskImage(playlistTile.playlist.image ?? playlistIcon())};
            }
        </style>

        <div id="tile-container">
            <div id="playlist-tile-container">
                <div id="playlist-image"></div>
                <div
                    id="language-icon"
                    language="${playlistTile.playlist.language}"
                    @click="${(e) => playlistTile.dispatchCustomEvent('changeLanguage')}"
                ></div>
                <svg id="instrumentation-button" class="inline-icon" viewBox="0 0 80 18">
                    <text y="80%" text-anchor="start"><!---->Playlist<!----></text>
                </svg>
                <div
                    id="nation-icon"
                    nation="${playlistTile.playlist.nation}"
                    @click="${(e) => playlistTile.dispatchCustomEvent('changeLanguage')}"
                ></div>
                <svg id="author-label" viewbox="0 0 200 18">
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        textLength="${playlistTile.playlist.author.length > 20 ? '200' : 'None'}"
                        lengthAdjust="${playlistTile.playlist.author.length > 20 ? 'spacingAndGlyphs' : 'None'}"
                    >
                        ${playlistTile.playlist.author}
                    </text>
                </svg>
                <div id="rating-container">
                    ${[1, 2, 3, 4, 5].map(
                        (rating) =>
                            html` <svg
                                viewBox="0 0 15 18"
                                class="star ${rating <= playlistTile.playlist.rating ? 'selected' : ''} ${rating <=
                                playlistTile.hoveredRating
                                    ? 'hovered'
                                    : ''}"
                            >
                                <text
                                    x="0"
                                    y="15"
                                    @pointerover="${() => (playlistTile.hoveredRating = rating)}"
                                    @pointerout="${() => (playlistTile.hoveredRating = 0)}"
                                    @click="${(e) => playlistTile.dispatchCustomEvent('changeRating', { rating })}"
                                >
                                    ★
                                </text>
                            </svg>`
                    )}
                </div>
            </div>
            <div id="tile-description">
                <div id="playlist-title">${playlistTile.playlist.name}</div>
                <div id="playlist-genre-section">${renderGenreTags(playlistTile)}</div>
            </div>
        </div>
    `;
}

/**
 * @param {PlaylistTile} playlistTile
 */
function renderGenreTags(playlistTile) {
    return playlistTile.playlist.genres.map((genre) => html` <tag-label .text="${genre}"></tag-label> `);
}
