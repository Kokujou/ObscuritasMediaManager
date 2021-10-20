import { css } from '../../exports.js';

export function renderLinkElementStyles() {
    return css`
        a {
            color: inherit;
            text-decoration: inherit;
            font-weight: inherit;
            font-size: inherit;
            cursor: pointer;

            display: flex;
            align-items: center;
            min-width: 100%;
            min-height: 100%;
        }
    `;
}
