import { css } from '../../exports.js';

export function renderGenreDialogStyles() {
    return css`
        #genre-container {
            max-height: 50vh;
            max-width: 50vw;
            overflow-y: auto;
        }

        .genre-section {
            position: relative;
            padding-top: 20px;
            padding-bottom: 20px;
            margin-left: 10px;
            margin-right: 10px;
        }

        .genre-section::after {
            content: ' ';
            position: absolute;
            left: 50px;
            bottom: 0;
            right: 50px;
            height: 1px;

            background-color: white;
        }

        .genre-section:last-of-type:after {
            display: none;
        }

        .section-title {
            font-size: 24px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 2px black;
        }

        .genre-checkbox {
            margin: 10px;
        }
    `;
}
