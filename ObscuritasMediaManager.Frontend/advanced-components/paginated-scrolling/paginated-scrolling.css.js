import { css } from '../../exports.js';

export function renderPaginatedScrollingStyles() {
    return css`
        :host {
            position: relative;
        }

        .scroll-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;

            overflow-y: scroll;
        }
    `;
}
