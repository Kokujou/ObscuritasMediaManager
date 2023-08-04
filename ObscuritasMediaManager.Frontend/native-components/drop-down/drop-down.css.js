import { css } from '../../exports.js';

export function renderDropDownStyles() {
    return css`
        :host {
            display: inline-block;
        }

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

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            color: inherit;
            border-bottom: 1px solid lightgray;
            padding: 10px 0;
        }

        #caption-container {
            flex: auto;
            white-space: nowrap;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 20px;
        }

        .dropdown-icon-container {
            display: flex;
            justify-content: right;
        }

        .dropdown.disabled {
            pointer-events: none;
            user-select: none;

            color: gray;
        }

        .dropdown-icon-container {
            transform: rotate(90deg);
            transform-origin: center center;
            transition: all 0.25s ease-in-out;
        }

        .dropdown-icon-container.dropped-down {
            transform: rotate(270deg);
        }

        .dropdown-icon-container * {
            height: 100%;
        }

        #dropdown-search {
            width: 100%;
            margin-top: 15px;
            margin-bottom: 15px;

            outline: none;
            background-color: transparent;
            border: none;
            padding: 10px 0;
            border-bottom: 1px solid lightgray;

            font: inherit;
            color: inherit;
            padding: 5px 0;
            font-weight: normal;
        }

        .options {
            position: absolute;
            top: 100%;

            padding: 10px 25px;

            color: var(--font-color);
            border: none;
            box-shadow: 0px 3px 6px #00000040;
            background-color: var(--accent-color-full);

            overflow-y: auto;

            z-index: 10;
        }

        .option {
            font-weight: 400;
            text-transform: capitalize;

            padding: 0 10px;
            width: auto;
            height: 40px;

            white-space: nowrap;

            display: flex;
            align-items: center;
        }

        .label {
            text-transform: capitalize;
            flex: auto;
        }

        :host(:not([useSearch]):not([multiselect])).option:hover,
        .option.selected {
            cursor: pointer;
            color: var(--dropdown-compact-hover-color, inherit);
            background: #666;
        }
    `;
}
