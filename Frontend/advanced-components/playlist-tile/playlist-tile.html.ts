import { html } from 'lit-element';
import { playlistIcon } from '../../resources/inline-icons/playlist-icons/playlist-icon.svg';
import { renderMaskImage } from '../../services/extensions/style.extensions';
import { PlaylistTile } from './playlist-tile';

export function renderPlaylistTile(this: PlaylistTile) {
    return html`
        <style>
            :host {
                --primary-color:radial-gradient(${this.radialColorString}) ,
                                conic-gradient( ${this.conicColorArray.join(',')});
                --secondary-color: var(--primary-color);
                --font-color: white;
            }

            #playlist-image {
                ${renderMaskImage(this.playlist.image ?? playlistIcon())};
            }
        </style>

        <div id="tile-container">
            <div id="playlist-tile-container">
                <div id="playlist-image"></div>
                <div
                    id="language-icon"
                    language="${this.playlist.language}"
                    @click="${() => this.dispatchEvent(new CustomEvent('changeLanguage'))}"
                ></div>
                <svg id="instrumentation-button" class="inline-icon" viewBox="0 0 80 18">
                    <text y="80%" text-anchor="start"><!---->Playlist<!----></text>
                </svg>
                <div
                    id="nation-icon"
                    nation="${this.playlist.nation}"
                    @click="${() => this.dispatchEvent(new CustomEvent('changeLanguage'))}"
                ></div>
                <svg id="author-label" viewbox="0 0 200 18">
                    <text
                        x="50%"
                        y="50%"
                        dominant-baseline="middle"
                        text-anchor="middle"
                        textLength="${(this.playlist.author?.length ?? 0) > 20 ? '200' : 'none'}"
                        lengthAdjust="${(this.playlist.author?.length ?? 0) > 20 ? 'spacingAndGlyphs' : 'none'}"
                    >
                        ${this.playlist.author}
                    </text>
                </svg>
                <div id="rating-container">
                    ${[1, 2, 3, 4, 5].map(
                        (rating) =>
                            html` <svg
                                viewBox="0 0 15 18"
                                class="star ${rating <= this.playlist.rating ? 'selected' : ''} ${rating <= this.hoveredRating
                                    ? 'hovered'
                                    : ''}"
                            >
                                <text
                                    x="0"
                                    y="15"
                                    @pointerover="${() => (this.hoveredRating = rating)}"
                                    @pointerout="${() => (this.hoveredRating = 0)}"
                                    @click="${(e: Event) =>
                                        this.dispatchEvent(new CustomEvent('changeRating', { detail: { rating } }))}"
                                >
                                    ★
                                </text>
                            </svg>`
                    )}
                </div>
            </div>
            <div id="tile-description">
                <div id="playlist-title">${this.playlist.name}</div>
                <div id="playlist-genre-section">${renderGenreTags.call(this)}</div>
            </div>
        </div>
    `;
}

function renderGenreTags(this: PlaylistTile) {
    return this.playlist.genres.map((genre) => html` <tag-label .text="${genre}"></tag-label> `);
}
