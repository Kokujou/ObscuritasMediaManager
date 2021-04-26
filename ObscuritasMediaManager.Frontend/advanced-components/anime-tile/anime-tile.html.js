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
            ${tile.disabled ? '' : html`<div class="rating-container">${renderRating(tile)}</div>`} <br />
            ${renderImageContainer(tile)}

            <div class="caption">${tile.name}</div>
            <div class="genre-list">
                ${tile.genres.map((genre) => renderGenreTag(tile, genre))} <br />
                ${tile.newGenre ? renderGenreTag(tile, 'test', true) : ''}
                ${!tile.disabled && !tile.newGenre
                    ? html`<div
                          class="add-genre-button"
                          @click="${(e) => {
                              e.stopPropagation();
                              tile.newGenre = true;
                          }}"
                      >
                          +
                      </div>`
                    : ''}
            </div>
        </div>
    `;
}

/**
 * @param {AnimeTile} tile
 */
function renderImageContainer(tile) {
    if (tile.imageSource)
        return html`<div class="tile-image">
            <div class="status-icon ${tile.status}"></div>
        </div>`;

    if (!tile.disabled) return html` <upload-area @imageReceived="${(e) => tile.notifyImageAdded(e.detail.imageData)}"></upload-area>`;
}

/**
 * @param {string} genre
 * @param {AnimeTile} tile
 */
function renderGenreTag(tile, genre = '', newGenre = false) {
    if (!genre) return;
    return html`<tag-label
        @tagCreated="${(e) => tile.addGenre(e.detail.value)}"
        @removed="${() => tile.removeGenre(genre)}"
        text="${genre}"
        .createNew="${newGenre}"
    ></tag-label>`;
}

/**
 * @param {AnimeTile} tile
 */
function renderRating(tile) {
    var ratingArray = [...Array(5).keys()];
    return ratingArray.map(
        (rating) =>
            html`
                <div
                    class="star ${rating < tile.rating ? 'selected' : ''} ${rating < tile.hoveredRating ? 'hovered' : ''}"
                    @pointerover="${() => (tile.hoveredRating = rating + 1)}"
                    @pointerout="${() => (tile.hoveredRating = 0)}"
                    @click="${(e) => tile.notifyRatingChanged(rating + 1, e)}"
                >
                    ★
                </div>
            `
    );
}
