import { css } from '../../exports.js';

export function renderStarRatingStyles() {
    return css`
        #star-container {
            display: flex;
            flex-direction: row;
        }

        .star {
            color: gray;
            font-size: 50px;
            padding: 0 5px;
            margin-top: -15px;
            margin-top: -10px;
            cursor: pointer;
        }

        .star[selected] {
            color: yellow !important;
        }

        .star:hover {
            color: orange;
        }
    `;
}
