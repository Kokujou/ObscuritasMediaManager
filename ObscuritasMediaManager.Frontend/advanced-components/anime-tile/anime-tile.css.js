import { css, unsafeCSS } from '../../exports.js';
import { plusIcon } from '../../resources/icons/plus-icon.svg.js';

export function renderAnimeTileStyles() {
    return css`
        :host {
            display: inline-block;
            position: relative;
        }

        .tile-container {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            user-select: none;
        }

        .tile-image {
            flex: auto;
            cursor: pointer;
            background-size: 100% 100%;
            margin: 20px;
        }

        .tile-image.unset {
            mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(plusIcon()))}');
            mask-size: 100% 100%;
            -webkit-mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(plusIcon()))}');
            -webkit-mask-size: 100% 100%;
            background-color: #bbbbbb77;
        }

        .caption {
            cursor: pointer;
            font-size: 30px;
            text-shadow: 2px 2px 2px black;
            color: white;
            text-align: center;
            margin-bottom: 10px;
        }

        .genre-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
        }

        .genre-list > * {
            margin-left: 5px;
            margin-bottom: 5px;
        }

        .add-genre-button {
            border-radius: 50%;
            width: 20px;
            height: 20px;
            background-color: #883377;
            display: flex;
            align-items: center;
            justify-content: center;
            color: lightgray;
            font-size: 16px;
            cursor: pointer;
        }

        br {
            display: none;
        }
    `;
}
