import { html } from '../../exports.js';
import { isNumberKey } from '../../services/keyboard.service.js';
import { MediaSearch } from './media-search.js';

/**
 * @param {MediaSearch} mediaSearch
 */
export function renderMediaSearch(mediaSearch) {
    return html`
        <div class="searchbar-container">
            <div class="searchbar">
                <input type="text" class="search-input textbox" placeholder="Suchbegriff" />
                <div class="extended-search-icon-container">
                    <div class="extended-search-icon"></div>
                </div>
            </div>
            <div class="result-options">
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
        <div class="filter-container">
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(
                    (rating) =>
                        html`<div @click="${() => MediaSearch.toggleRating(rating)}" class="star ${MediaSearch.getRatingClass(rating)}">
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
        <div class="episode-count-filter">
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
        <div class="release-date-filter">
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
