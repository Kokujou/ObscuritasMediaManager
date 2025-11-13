import { css } from 'lit-element';

export function renderWarningBannerStyles() {
    return css`
        :host([dismissed]) {
            display: none;
        }

        :host {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: yellow;

            color: black;
            font-size: 16px;
            font-weight: bold;

            padding: 10px;
            z-index: 1;
        }

        .banner-x-button {
            position: absolute;
            right: 20px;
            top: 0;
            bottom: 0;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        a {
            color: blue;
            cursor: pointer;
        }

        .banner-link:hover {
            text-decoration: underline;
        }
    `;
}
