import { css } from 'lit';

export function renderStarRatingStyles() {
    return css`
        #star-container {
            display: flex;
            flex-direction: row;
            font-size: var(--font-size, 40px);
        }

        .star {
            color: gray;
            font-weight: bold;
            padding: 0 5px;
            margin-top: -15px;
            margin-top: -10px;
            cursor: pointer;
            text-shadow: 3px 3px 3px black;
        }

        .star[selected] {
            color: yellow;
        }

        :host([swords]) .star[selected] {
            color: red;
        }

        .star:hover,
        .star[hovered] {
            color: orange !important;
        }
    `;
}
