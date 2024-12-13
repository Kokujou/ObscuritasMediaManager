import { html } from 'lit-element';
import { MediaGenreCategory, MediaGenreModel } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { MediaTile } from './media-tile';

export function renderMediaTile(this: MediaTile) {
    return html` <style>
            #tile-image {
                background-image: url('./Backend/api/media/${this.media.id}/image?rev=${this.imageRevision}');
            }
        </style>

        <img
            id="dummy-image"
            src="./Backend/api/media/${this.media.id}/image?rev=${this.imageRevision}"
            @load="${() => (this.hasImage = true)}"
            @error="${() => (this.hasImage = false)}"
        />

        <div id="tile-container">
            ${this.displayStyle == 'simple' ? '' : html`<div id="rating-container">${renderRating.call(this)}</div>`} <br />
            ${renderImageContainer.call(this)}
            ${this.displayStyle == 'solid'
                ? html` <div ?no-background="${!this.hasImage}" id="caption">${this.media.name}</div> `
                : ''}
        </div>
        ${this.displayStyle == 'solid'
            ? html`
                  <div id="genre-list" @click="${(e: Event) => e.preventDefault()}">
                      ${this.media.genres
                          .filter((x) => x.section == MediaGenreCategory.MainGenre)
                          .map((genre) => renderGenreTag.call(this, genre))}
                      <br />
                  </div>
              `
            : ''}
        <slot></slot>`;
}

function renderImageContainer(this: MediaTile) {
    if (this.hasImage)
        return html`<div id="tile-image">
            <div class="status-icon ${this.media.status}"></div>
        </div>`;

    return html` <div id="no-image-icon" icon="${Icons.Cross}"></div> `;
}

function renderGenreTag(this: MediaTile, genre: MediaGenreModel | null = null) {
    if (!genre) return;
    return html`<tag-label
        .autocomplete="${this.autocompleteGenres ?? []}"
        @tagCreated="${() => this.addGenre(genre)}"
        disabled
        text="${genre?.name}"
    ></tag-label>`;
}

function renderRating(this: MediaTile) {
    var ratingArray = [...Array(5).keys()];
    return ratingArray.map(
        (rating) =>
            html`
                <div
                    class="star ${rating < this.media.rating ? 'selected' : ''} ${rating < this.hoveredRating ? 'hovered' : ''}"
                    @pointerover="${() => (this.hoveredRating = rating + 1)}"
                    @pointerout="${() => (this.hoveredRating = 0)}"
                    @click="${(e: Event) => this.notifyRatingChanged(rating + 1, e)}"
                >
                    ★
                </div>
            `
    );
}
