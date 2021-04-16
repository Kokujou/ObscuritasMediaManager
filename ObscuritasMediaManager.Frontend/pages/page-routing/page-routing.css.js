import { css } from '../../exports.js';

export function renderPageRoutingStyles() {
    return css`
        :host {
            --accent-color: #5555ff55;
            --accent-color-full: #5555ff;
        }

        .current-page {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;

            overflow: hidden;

            background-image: url('../../resources/images/yjqccu7y.bmp');
            background-blend-mode: overlay;
            background-size: 100% 100%;
            background-repeat: no-repeat;

            font-family: Arial, Helvetica, sans-serif;
            color: lightseagreen;
        }
    `;
}
