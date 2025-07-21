import { css } from 'lit-element';

export function renderDropDownStyles() {
    return css`
        :host {
            display: inline-block;
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
            border-bottom: 2px solid lightgray;
            padding: 10px 0;
        }

        :host([disabled]) .dropdown {
            border: none;
            pointer-events: none;
        }

        #caption-container {
            flex: auto;
            white-space: nowrap;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 10px;
        }

        .dropdown-icon-container {
            display: flex;
            justify-content: right;
        }

        :host([disabled]) .dropdown-icon-container {
            display: none;
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

        .options {
            position: absolute;
            top: 100%;
            width: var(--option-width, 100%);
            min-width: max-content;

            display: flex;
            flex-direction: column;
            gap: 10px;

            color: var(--font-color);
            border: none;
            box-shadow: 0px 3px 6px #00000040;
            background-color: var(--accent-color-full);

            overflow-y: auto;
            overscroll-behavior: contain;

            z-index: 10;
        }

        .options:not([visible]) {
            max-height: 0;
        }

        #dropdown-search {
            width: calc(100% - 30px);
            padding: 5px 10px;
            margin: 15px;
            margin-bottom: 5px;
            box-sizing: border-box;

            outline: none;
            background-color: transparent;
            border: none;
            border-bottom: 2px solid lightgray;

            font: inherit;
            color: inherit;
            font-weight: normal;
        }

        .option {
            line-height: 40px;
            padding: 0 20px;

            font-weight: 400;
            text-transform: capitalize;

            white-space: nowrap;

            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .label {
            text-transform: capitalize;
            flex: auto;
        }

        custom-toggle {
            margin: 10px 0;
        }

        .option:hover,
        .option.selected {
            cursor: pointer;
            color: var(--dropdown-compact-hover-color, inherit);
            background: #666;
        }
    `;
}
