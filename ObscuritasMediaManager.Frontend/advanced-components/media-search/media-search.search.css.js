import { css } from '../../exports.js';

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

        .searchbar-container {
            display: flex;
            flex-direction: column;
            margin: 0 200px;
            align-items: stretch;
            position: relative;
        }

        .searchbar {
            display: flex;
            flex-direction: row;

            align-items: center;
        }

        .search-input {
            font-size: 18px;

            margin-top: 10px;
            margin-right: 10px;
        }

        .extended-search-icon-container {
            --search-icon-shadow: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.75));

            -webkit-filter: var(--search-icon-shadow);
            -moz-filter: var(--search-icon-shadow);
            -ms-filter: var(--search-icon-shadow);
            -o-filter: var(--search-icon-shadow);
            filter: var(--search-icon-shadow);
        }

        .extended-search-icon-container:hover {
            --search-icon-shadow: drop-shadow(0px 0px 8px rgba(0, 0, 0, 1));
        }

        .extended-search-icon {
            mask-image: url('../../resources/images/settings.svg');
            mask-size: 100% 100%;
            mask-repeat: no-repeat;

            -webkit-mask-image: url('../../resources/images/settings.svg');
            -webkit-mask-size: 100% 100%;
            -webkit-mask-repeat: no-repeat;

            background: gray;
            width: 50px;
            height: 50px;

            cursor: pointer;
        }
    `;
}
