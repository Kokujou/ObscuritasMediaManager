import { css } from '../../exports.js';

export function renderMusicFilterStyles() {
    return css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            min-height: 0;
            max-width: 100%;
        }

        #search-panel-container > * {
            margin: 10px 0;
        }

        #search-panel {
            display: flex;
            flex-direction: column;

            width: 100%;
            flex: auto;
            margin: 20px 0;
            gap: 30px;

            font-size: 24px;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
        }

        #search-heading {
            font-size: 30px;
            text-align: center;

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            margin-top: 30px;
        }

        #search-heading .inline-icon {
            margin-left: 20px;
        }

        .filter > .filter-heading {
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;
            width: 100%;
            margin-bottom: 20px;
        }

        .filter-row {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        .filter[simple] {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
        }

        .filter[simple] label {
            width: 250px;
        }

        custom-toggle {
            box-shadow: 0 0 10px #999;
        }

        #show-deleted-toggle {
            --slider-color: #aaa;
            --toggled-color: #f008;
            --untoggled-color: #f004;
        }

        .heading-label {
            margin-right: auto;
        }

        .popup-icon {
            margin-left: 20px;
        }

        .reset-icon {
            margin-right: 20px;
            margin-left: auto;
        }

        #search-panel > * {
            flex: auto;
        }

        .side-scroller-container {
            position: relative;
            width: 100%;
            padding: 0 30px;
            box-sizing: border-box;
        }

        side-scroller {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;

            color: white;
        }

        .icon-container {
            margin-right: 20px;
        }

        .inline-icon,
        .icon-button {
            width: 30px;
            height: 30px;
            cursor: pointer;

            background-color: #ffffff99;
        }

        .icon-button {
            margin: 0 5px;
        }

        #complete-input,
        #show-playlists-input {
            margin-left: 20px;
        }

        #sorting-container {
            display: inline-flex;
            flex-direction: row;
            width: 100%;
            margin-right: 10px;
        }

        #ascending-icon[active],
        #descending-icon[active] {
            background-color: white;
        }

        #ascending-icon,
        #descending-icon {
            width: 40px;
            height: 40px;
        }

        #sorting-container > *:first-child {
            margin-left: 0;
        }

        #sorting-container > * {
            margin: 0 10px;
        }

        drop-down {
            font: inherit;
            font-size: 20px;
            width: 90%;

            color: white;
            --toggled-color: purple;
        }

        input[type='text'] {
            font-size: 20px;
            width: 100%;
            background: transparent;
            color: var(--font-color);
            border: none;
            border-bottom: 5px solid black;
            padding: 10 20px;
            outline: none;
        }

        input[type='checkbox'] {
            transform: scale(1.5);
            margin: 0 20px;
        }

        #complete-filter,
        #show-playlists-filter {
            display: flex;
            align-items: center;
        }
    `;
}
