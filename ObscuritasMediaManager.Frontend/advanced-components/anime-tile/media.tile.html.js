import { html } from '../../exports.js';
import { MediaTile } from './media-tile.js';

/**
 * @param {MediaTile} tile
 */
export function renderMediaTile(tile) {
    return html` <style>
            .tile-image {
                background-image: url('${tile.imageSource}');
            }
        </style>

        <div class="tile-container">
            ${tile.displayStyle == 'simple' ? '' : html`<div class="rating-container">${renderRating(tile)}</div>`} <br />
            ${renderImageContainer(tile)}

            <div class="caption">${tile.name}</div>
        </div>
        ${tile.displayStyle == 'solid'
            ? html`
                  <div class="genre-list">
                      ${tile.genres.map((genre) => renderGenreTag(tile, genre))} <br />
                      ${tile.newGenre ? renderGenreTag(tile, 'test', true) : ''}
                      ${!tile.newGenre
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
              `
            : ''}
        <slot></slot>`;
}

/**
 * @param {MediaTile} tile
 */
function renderImageContainer(tile) {
    if (tile.imageSource)
        return html`<div class="tile-image">
            <div class="status-icon ${tile.status}"></div>
        </div>`;

    return html` <upload-area @imageReceived="${(e) => tile.notifyImageAdded(e.detail.imageData)}"></upload-area>`;
}

/**
 * @param {string} genre
 * @param {MediaTile} tile
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
 * @param {MediaTile} tile
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
