import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { css } from '../../exports.js';
import { registerIcons } from '../../resources/icons/icon-registry.js';

export function renderPlaylistTileStyles() {
    return css`
        ${registerIcons()}

        :host {
            position: relative;
            transform: rotate(0deg);
            display: inline-flex;
            flex-direction: column;
        }

        #playlist-tile-container {
            min-height: var(--audio-tile-min-height);
            margin-bottom: 10px;
            border-radius: 10%;
            background-color: var(--primary-color);
            overflow: hidden;
            position: relative;
        }

        #playlist-image {
            position: absolute;
            inset: 25%;
            background-color: var(--font-color);

            cursor: pointer;
        }

        .inline-icon {
            width: 12%;
            height: 12%;
            background-color: var(--font-color);
            border-radius: 2%;
            cursor: pointer;
            filter: drop-shadow(0 0 5px black);
        }

        #instrumentation-button {
            position: absolute;
            left: 7.5%;
            top: 7.5%;
            width: 40%;
            height: 10%;

            background: none;
            text-transform: uppercase;
            font-weight: bold;
            font-family: inherit;
            stroke: var(--font-color);
            fill: var(--font-color);
        }

        #nation-icon,
        #language-icon {
            position: absolute;
            right: 5%;
            top: 5%;
            width: 20%;
            height: 20%;
            border-radius: 100%;
            cursor: pointer;
            filter: drop-shadow(0 0 5px black);
        }

        #nation-icon {
            mask: linear-gradient(295deg, white 0 50%, transparent 50% 100%);
        }

        #language-icon {
            mask: linear-gradient(115deg, white 0 50%, transparent 50% 100%);
        }

        ${renderLanguageFlags()}

        #rating-container {
            position: absolute;
            top: 20%;
            left: 5%;
            width: 10%;
            height: 70%;

            filter: drop-shadow(3px 3px 3px black);
        }

        #rating-container .star {
            stroke: gray;
            fill: gray;
            width: 100%;

            cursor: pointer;
            line-height: 1;
        }

        #rating-container .star.selected {
            stroke: yellow;
            fill: yellow;
        }

        #rating-container .star.hovered {
            stroke: darkorange;
            fill: darkorange;
        }

        *[disabled] {
            pointer-events: none;
        }

        #author-label {
            position: absolute;
            width: 100%;
            bottom: 7.5%;
            height: 10%;
            padding-left: 7.5%;
            padding-right: 7.5%;
            box-sizing: border-box;

            background: none;
            text-transform: uppercase;
            font-weight: bold;
            font-family: inherit;
            stroke: var(--font-color);
            fill: var(--font-color);
        }

        #tile-container {
            position: relative;
            min-height: inherit;
            width: var(--playlist-tile-width);

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--secondary-color) 0 100%);
            box-shadow: 0 0 50px var(--secondary-color);

            border-radius: 20px;
            box-sizing: border-box;

            padding: 10px;

            user-select: none;
            cursor: pointer;
            color: var(--font-color);
        }

        #tile-description {
            flex: auto;
            display: flex;
            flex-direction: column;
        }

        .inline-icon.unset {
            display: none;
        }

        #playlist-title {
            font-size: 24px;
            text-align: center;

            overflow: hidden;
        }

        #playlist-genre-section {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            max-height: 35px;

            margin-top: 10px;
            overflow: hidden;

            mask: linear-gradient(to bottom, black 0% 50%, transparent 100%);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            transition: all 1s ease-out;
        }

        :host(:hover) #playlist-genre-section {
            max-height: 150px;
            mask-size: 100% 300%;
        }

        #playlist-genre-section * {
            margin-left: 5px;
            margin-bottom: 5px;
            z-index: 1;
            --label-color: var(--primary-color);
        }
    `;
}
