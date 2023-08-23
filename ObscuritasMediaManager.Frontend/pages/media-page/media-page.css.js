import { css } from '../../exports.js';
import { importIcon } from '../../resources/inline-icons/general/import-icon.svg.js';
import { plusIcon } from '../../resources/inline-icons/general/plus-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderMediaPageStyles() {
    return css`
        #media-page-container {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            max-height: 100%;
        }

        #media-filter {
            position: absolute;
            right: 0px;
            top: 10px;
            width: 450px;
            height: 700px;
        }

        #results {
            position: absolute;
            bottom: 0;
            top: 0;
            left: 0;
            right: 500px;
            margin-left: 60px;
        }

        #result-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 60px;
            padding: 80px 0;
        }

        #tile-button {
            width: 200px;
            height: 200px;

            cursor: pointer;
        }

        media-tile {
            cursor: pointer;
            width: 200px;
            min-height: 200px;
        }

        #add-button {
            background-color: #bbbbbb77;
            ${renderMaskImage(plusIcon())};
        }

        #import-button {
            background-color: #bbbbbb77;
            ${renderMaskImage(importIcon())};
        }

        video:not([src=]) {
            position: fixed !important;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
        }
    `;
}
