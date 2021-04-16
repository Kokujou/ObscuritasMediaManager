import { html } from '../../exports.js';
import { AnimeTile } from './anime-tile.js';

/**
 * @param {AnimeTile} tile
 */
export function renderAnimeTile(tile) {
    return html`
        <style>
            .tile-image {
                background-image: url('${tile.imageSource}');
            }
        </style>

        <div class="tile-container">
            <div class="tile-image ${tile.imageSource ? '' : 'unset'}" @click=${() => tile.notifyImageClicked()}>
                <div class="rating ${tile.rating}"></div>
                <div class="status-icon ${tile.status}"></div>
            </div>

            <div class="caption">${tile.name}</div>
            <div class="genre-list">
                ${tile.genres.map((genre) => renderGenreTag(genre, tile))} <br />
                ${tile.genres[tile.genres.length - 1]
                    ? html`<div class="add-genre-button" @click="${() => tile.addGenre('')}">+</div>`
                    : ''}
            </div>
        </div>
    `;
}

/**
 * @param {string} genre
 * @param {AnimeTile} tile
 */
function renderGenreTag(genre, tile) {
    return html`<tag-label
        @tagCreated="${(e) => tile.addGenre(e.detail.value)}"
        @removed="${() => (tile.genres = tile.genres.filter((x) => x != genre))}"
        text="${genre}"
    ></tag-label>`;
}
