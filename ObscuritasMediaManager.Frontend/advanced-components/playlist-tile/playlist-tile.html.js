import { html } from '../../exports.js';
import { playlistIcon } from '../../resources/icons/playlist-icons/playlist-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { PlaylistTile } from './playlist-tile.js';

/**
 * @param { PlaylistTile } playlist
 */
export function renderPlaylistTile(playlist) {
    return html`
        <style>
            :host {
                --primary-color:radial-gradient(${playlist.radialColorString}) ,
                                conic-gradient( ${playlist.conicColorArray.join(',')});
                --secondary-color: var(--primary-color);
                --font-color: white;
            }

            #playlist-image {
                ${renderMaskImage(playlist.playlist.image ?? playlistIcon())};
            }
        </style>

        <div id="tile-container">
            <div id="playlist-tile-container">
                <div id="playlist-image"></div>
                <div
                    id="language-icon"
                    language="${playlist.playlist.language}"
                    @click="${(e) => playlist.dispatchCustomEvent('changeLanguage')}"
                ></div>
                <svg id="instrumentation-button" class="inline-icon" viewBox="0 0 80 18">
                    <text y="80%" text-anchor="start"><!---->Playlist<!----></text>
                </svg>
                <div
                    id="nation-icon"
                    nation="${playlist.playlist.nation}"
                    @click="${(e) => playlist.dispatchCustomEvent('changeLanguage')}"
                ></div>
                <svg id="author-label" viewbox="0 0 200 18">
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        textLength="${playlist.playlist.author.length > 20 ? '200' : 'None'}"
                        lengthAdjust="${playlist.playlist.author.length > 20 ? 'spacingAndGlyphs' : 'None'}"
                    >
                        ${playlist.playlist.author}
                    </text>
                </svg>
                <div id="rating-container">
                    ${[1, 2, 3, 4, 5].map(
                        (rating) =>
                            html` <svg
                                viewBox="0 0 15 18"
                                class="star ${rating <= playlist.playlist.rating ? 'selected' : ''} ${rating <=
                                playlist.hoveredRating
                                    ? 'hovered'
                                    : ''}"
                            >
                                <text
                                    x="0"
                                    y="15"
                                    @pointerover="${() => (playlist.hoveredRating = rating)}"
                                    @pointerout="${() => (playlist.hoveredRating = 0)}"
                                    @click="${(e) => playlist.dispatchCustomEvent('changeRating', { rating })}"
                                >
                                    ★
                                </text>
                            </svg>`
                    )}
                </div>
            </div>
            <div id="tile-description">
                <div id="playlist-title">${playlist.playlist.name}</div>
                <div id="playlist-genre-section">${renderGenreTags(playlist)}</div>
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
