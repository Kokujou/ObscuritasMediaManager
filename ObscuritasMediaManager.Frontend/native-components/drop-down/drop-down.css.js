import { css } from '../../exports.js';

export function renderDropDownStyles() {
    return css`
        * {
            scrollbar-width: thin;
        }

        #empty-text-placeholder {
            position: relative;
            visibility: hidden;
            left: 0;
            top: 0;
        }

        .dropdown {
            position: relative;
            user-select: none;

            padding: 20px;
            padding-right: 50px;
        }

        .dropdown-icon-container {
            position: absolute;
            right: 20px;
            top: 23px;
            bottom: 23px;

            display: flex;
            justify-content: right;
        }

        .dropdown.disabled {
            pointer-events: none;
            user-select: none;

            color: gray;
        }

        .dropdown-icon-container > svg,
        .dropdown-icon-container.dropped-down {
            -webkit-transition: all 0.25s ease-in-out;
            -moz-transition: all 0.25s ease-in-out;
            -ms-transition: all 0.25s ease-in-out;
            -o-transition: all 0.25s ease-in-out;
            transition: all 0.25s ease-in-out;
        }

        .dropdown-icon-container > svg {
            transform: rotate(0deg);
        }

        .dropdown-icon-container.dropped-down > svg {
            transform: rotate(180deg);
        }

        .dropdown-icon-container * {
            height: 100%;
        }

        #dropdown-search {
            width: 100%;
            margin-top: 15px;
            margin-bottom: 15px;
            font: inherit;
            color: inherit;
            padding: 5px 0;
            font-weight: normal;
        }

        .options {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;

            overflow-y: auto;

            z-index: 10;
        }

        .option {
            font-weight: 400;
            height: 60px;
            width: auto;
            padding: 0 20px;

            display: flex;
            align-items: center;
        }
    `;
}
