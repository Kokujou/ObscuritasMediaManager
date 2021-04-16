import { css } from '../../exports.js';

export function renderSearchFilterStyles() {
    return css`
        .result-options {
            top: 100%;
            position: absolute;
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            flex-wrap: wrap;
        }

        .result-options > * {
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .result-options > :last-of-type {
            margin-right: 0;
            margin-bottom: 0;
        }

        .filter-container .star-rating {
            width: 250px;
            display: flex;
            flex-direction: row;
            font-size: 40px;
            justify-content: center;
        }

        .star-rating .star {
            color: gray;
            margin: 5px;
            margin-top: 0;
            text-shadow: 3px 3px 3px black;
            cursor: pointer;
        }

        .star-rating .star.selected {
            color: yellow;
        }

        .episode-count-filter,
        .release-date-filter {
            width: 200px;
            margin: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;

            font-size: 18px;
        }

        .episode-count-filter > *,
        .release-date-filter > * {
            margin-right: 10px;
        }

        .episode-count-filter > :last-child,
        .release-date-filter > :last-child {
            margin-right: 0;
        }

        .number-input {
            flex: auto;
            min-width: 0;
            font-size: 18px;
            padding: 15px 20px;
        }
    `;
}
