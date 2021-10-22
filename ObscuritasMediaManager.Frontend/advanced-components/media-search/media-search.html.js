import { html } from '../../exports.js';
import { isNumberKey } from '../../services/extensions/keyboard.extensions.js';
import { MediaSearch } from './media-search.js';

/**
 * @param {MediaSearch} mediaSearch
 */
export function renderMediaSearch(mediaSearch) {
    return html`
        <div id="searchbar-container">
            <div id="searchbar">
                <input
                    type="text"
                    id="search-input"
                    class="textbox"
                    placeholder="Suchbegriff"
                    @input="${(e) => e.target.dispatchEvent(new Event('change'))}"
                    @change="${() => mediaSearch.updateSearchTextFilter()}"
                />
                <div class="icon-container" @click="${() => mediaSearch.resetFilters()}">
                    <div id="reset-icon"></div>
                </div>
                <div class="icon-container">
                    <div id="extended-search-icon"></div>
                </div>
            </div>
            <div id="result-options">
                ${renderRatingFitler(mediaSearch)}<br />
                ${renderEpisodeCountFilter(mediaSearch)}<br />
                ${renderReleaseDateFilter(mediaSearch)}<br />
                <expandable-dropdown caption="Tags" ?disabled="${true}" @click="${() => mediaSearch.showGenreDialog()}">
                </expandable-dropdown>
            </div>
        </div>
    `;
}

/**
 * @param {MediaSearch} MediaSearch
 */
function renderRatingFitler(MediaSearch) {
    return html`<expandable-dropdown caption="Bewertung">
        <div id="filter-container">
            <div id="star-rating">
                ${[1, 2, 3, 4, 5].map(
                    (rating) =>
                        html`<div
                            @click="${() => MediaSearch.toggleRating(rating)}"
                            class="star ${MediaSearch.getRatingClass(rating)}"
                        >
                            ★
                        </div>`
                )}
            </div>
        </div>
    </expandable-dropdown> `;
}

/**
 * @param {MediaSearch} MediaSearch
 */
function renderEpisodeCountFilter(MediaSearch) {
    return html`<expandable-dropdown caption="Episodenzahl">
        <div id="episode-count-filter">
            ${renderNumberInput('left-episode-count', '0', () => MediaSearch.updateEpisodeFilter())}
            <div class="separator">-</div>
            ${renderNumberInput('right-episode-count', '9999', () => MediaSearch.updateEpisodeFilter())}
        </div>
    </expandable-dropdown>`;
}

/**
 * @param {MediaSearch} MediaSearch
 */
function renderReleaseDateFilter(MediaSearch) {
    return html`<expandable-dropdown caption="Veröffentlichung">
        <div id="release-date-filter">
            ${renderNumberInput('left-release-date', '1900', () => MediaSearch.udpateReleaseDateFilter())}
            <div class="separator">-</div>
            ${renderNumberInput('right-release-date', `${new Date().getFullYear()}`, () => MediaSearch.udpateReleaseDateFilter())}
        </div>
    </expandable-dropdown> `;
}

function renderNumberInput(id, value = '', onKeyUp) {
    return html`<input
        type="text"
        id="${id}"
        class="textbox number-input"
        maxlength="4"
        inputmode="numeric"
        value="${value}"
        @keydown="${(e) => isNumberKey(e)}"
        @keyup="${() => onKeyUp()}"
    />`;
}
