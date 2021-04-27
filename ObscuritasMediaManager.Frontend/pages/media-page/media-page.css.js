import { css, unsafeCSS } from '../../exports.js';
import { importIcon } from '../../resources/icons/import-icon.svg.js';
import { plusIcon } from '../../resources/icons/plus-icon.svg.js';

export function renderMediaPageStyles() {
    return css`
        .media-page-container {
            display: flex;
            flex-direction: column;
            max-height: 100%;
        }

        .search-result-container {
            overflow-y: scroll;
            position: relative;
            bottom: 0;
            top: 0;
            left: 0;
            right: 0;

            margin-top: 100px;
            scrollbar-color: #20625599 transparent;
            scrollbar-width: thin;
        }

        .right-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
        }

        .right-container > * {
            margin-left: 60px;
            margin-bottom: 60px;
        }

        .tile-button {
            width: 200px;
            height: 200px;

            cursor: pointer;
        }

        anime-tile {
            width: 300px;
            min-height: 300px;
        }

        .add-button {
            mask-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(plusIcon()))}');
            mask-size: 100% 100%;

            -webkit-mask-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(plusIcon()))}');
            -webkit-mask-size: 100% 100%;

            background-color: #bbbbbb77;
        }

        .import-button {
            mask-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(importIcon()))}');
            mask-size: 100% 100%;

            -webkit-mask-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(importIcon()))}');
            -webkit-mask-size: 100% 100%;

            background-color: #bbbbbb77;
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
