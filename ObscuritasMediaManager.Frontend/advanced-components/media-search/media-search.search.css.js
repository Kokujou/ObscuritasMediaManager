import { css } from '../../exports.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { resetIcon } from './images/reset-icon.svg.js';
import { settingsIcon } from './images/settings-icon.svg.js';

export function renderSearchStyles() {
    return css`
        .textbox {
            flex: auto;

            background-color: var(--accent-color);
            border: none;

            color: inherit;

            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 0 5px black;
        }

        .textbox:focus {
            outline: none;
            box-shadow: 0 0 5px;
        }

        .textbox:invalid {
            box-shadow: 0 0 5px red;
        }

        #searchbar-container {
            display: flex;
            flex-direction: column;
            margin: 0 200px;
            align-items: stretch;
            position: relative;
        }

        #searchbar {
            display: flex;
            flex-direction: row;

            align-items: center;
        }

        #search-input {
            font-size: 18px;

            margin-top: 10px;
            margin-right: 10px;
        }

        .icon-container {
            --search-icon-shadow: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75));

            -webkit-filter: var(--search-icon-shadow);
            -moz-filter: var(--search-icon-shadow);
            -ms-filter: var(--search-icon-shadow);
            -o-filter: var(--search-icon-shadow);
            filter: var(--search-icon-shadow);
        }

        .icon-container:hover {
            --search-icon-shadow: drop-shadow(0px 0px 8px rgba(0, 0, 0, 1));
        }

        #extended-search-icon {
            ${renderMaskImage(settingsIcon())};

            background: gray;
            width: 50px;
            height: 50px;

            cursor: pointer;
        }

        #reset-icon {
            ${renderMaskImage(resetIcon())};

            background: darkred;
            width: 50px;
            height: 50px;

            cursor: pointer;
        }
    `;
}
