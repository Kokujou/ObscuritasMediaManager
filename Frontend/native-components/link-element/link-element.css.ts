import { css } from 'lit-element';

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
            justify-content: inherit;
            min-width: 100%;
            min-height: inherit;
        }
    `;
}
