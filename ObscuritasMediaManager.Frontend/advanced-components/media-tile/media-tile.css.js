import { css } from '../../exports.js';

export function renderMediaTileStyles() {
    return css`
        :host {
            display: inline-flex;
            flex-direction: column;
        }

        #tile-container {
            position: relative;
            width: 100%;
            min-height: inherit;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            user-select: none;
        }

        #tile-image {
            position: relative;
            flex: auto;

            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;

            margin: 20px;
            display: flex;
            flex-direction: row;
        }

        #rating-container {
            position: absolute;
            top: 20px;
            right: 30px;
            z-index: 1;
        }

        #rating-container .star {
            color: gray;
            text-shadow: 3px 3px 3px black;
            font-size: 36px;
            cursor: pointer;
            line-height: 1;
        }

        #rating-container .star.selected {
            color: yellow;
        }

        #rating-container .star.hovered {
            color: darkorange;
        }

        #caption {
            cursor: pointer;
            font-size: 30px;
            text-shadow: 2px 2px 2px black;
            color: white;
            text-align: center;
            margin-bottom: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            transition: max-height 1s ease;
            max-height: 35px;
        }

        #genre-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            max-height: 35px;
            overflow: hidden;
            gap: 5px;
            transition: max-height 1s ease;
        }

        :host(:hover) #genre-list {
            max-height: 150px;
        }

        :host(:hover) #caption {
            text-overflow: initial;
            max-height: 105px;
        }

        #genre-list > * {
            margin-left: 5px;
            margin-bottom: 5px;
        }

        #add-genre-button {
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
