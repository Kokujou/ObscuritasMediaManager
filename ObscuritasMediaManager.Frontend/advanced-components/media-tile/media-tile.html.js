import { html } from '../../exports.js';
import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { MediaTile } from './media-tile.js';

/**
 * @param {MediaTile} tile
 */
export function renderMediaTile(tile) {
    return html` <style>
            #tile-image {
                background-image: url('data:image/jpeg;base64, ${tile.media.image}');
            }
        </style>

        <div id="tile-container">
            ${tile.displayStyle == 'simple' ? '' : html`<div id="rating-container">${renderRating(tile)}</div>`} <br />
            ${renderImageContainer(tile)}
            ${tile.displayStyle == 'solid'
                ? html` <div ?no-background="${!tile.media.image}" id="caption">${tile.media.name}</div> `
                : ''}
        </div>
        ${tile.displayStyle == 'solid'
            ? html`
                  <div id="genre-list" @click="${(e) => e.preventDefault()}">
                      ${tile.media.genres.slice(0, 4).map((genre) => renderGenreTag(tile, genre))} <br />
                  </div>
              `
            : ''}
        <slot></slot>`;
}

/**
 * @param {MediaTile} tile
 */
function renderImageContainer(tile) {
    if (tile.media.image)
        return html`<div id="tile-image">
            <div class="status-icon ${tile.media.status}"></div>
        </div>`;

    return html` <upload-area @imageReceived="${(e) => tile.notifyImageAdded(e.detail.imageData)}"></upload-area>`;
}

/**
 * @param {GenreModel} genre
 * @param {MediaTile} tile
 */
function renderGenreTag(tile, genre = null) {
    if (!genre) return;
    return html`<tag-label
        .autocomplete="${tile.autocompleteGenres}"
        @tagCreated="${(e) => tile.addGenre(genre)}"
        disabled
        text="${genre?.name}"
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
                    class="star ${rating < tile.media.rating ? 'selected' : ''} ${rating < tile.hoveredRating ? 'hovered' : ''}"
                    @pointerover="${() => (tile.hoveredRating = rating + 1)}"
                    @pointerout="${() => (tile.hoveredRating = 0)}"
                    @click="${(e) => tile.notifyRatingChanged(rating + 1, e)}"
                >
                    ★
                </div>
            `
    );
}
