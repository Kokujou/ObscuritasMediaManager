import { css } from '../../exports.js';
import { renderSearchFilterStyles } from './media-search.search-filter.css.js';
import { renderSearchStyles } from './media-search.search.css.js';

export function renderMediaSearchStyles() {
    return css`
        ${renderSearchStyles()}

        ${renderSearchFilterStyles()}
    `;
}
