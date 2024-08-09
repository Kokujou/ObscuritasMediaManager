import { html } from '../../exports.js';
import { MediaGenreCategory, MediaGenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { MediaTile } from './media-tile.js';

/**
 * @param {MediaTile} tile
 */
export function renderMediaTile(tile) {
    return html` <style>
            #tile-image {
                background-image: url('./Backend/api/media/${tile.media.id}/image?rev=${tile.imageRevision}');
            }
        </style>

        <img
            id="dummy-image"
            src="./Backend/api/media/${tile.media.id}/image?rev=${tile.imageRevision}"
            @load="${() => (tile.hasImage = true)}"
            @error="${() => (tile.hasImage = false)}"
        />

        <div id="tile-container">
            ${tile.displayStyle == 'simple' ? '' : html`<div id="rating-container">${renderRating(tile)}</div>`} <br />
            ${renderImageContainer(tile)}
            ${tile.displayStyle == 'solid'
                ? html` <div ?no-background="${!tile.hasImage}" id="caption">${tile.media.name}</div> `
                : ''}
        </div>
        ${tile.displayStyle == 'solid'
            ? html`
                  <div id="genre-list" @click="${(e) => e.preventDefault()}">
                      ${tile.media.genres
                          .filter((x) => x.section == MediaGenreCategory.MainGenre)
                          .map((genre) => renderGenreTag(tile, genre))}
                      <br />
                  </div>
              `
            : ''}
        <slot></slot>`;
}

/**
 * @param {MediaTile} tile
 */
function renderImageContainer(tile) {
    if (tile.hasImage)
        return html`<div id="tile-image">
            <div class="status-icon ${tile.media.status}"></div>
        </div>`;

    return html` <div id="no-image-icon" icon="${Icons.Cross}"></div> `;
}

/**
 * @param {MediaGenreModel} genre
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
