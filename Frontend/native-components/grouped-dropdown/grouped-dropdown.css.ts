import { css } from 'lit';

export function renderGroupedDropdownStyles() {
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
            -webkit-user-select: none;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            color: inherit;
            border-bottom: 2px solid lightgray;
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
            -webkit-user-select: none;

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
            left: 0;

            padding: 10px 0;

            color: var(--font-color);
            border: none;
            box-shadow: 0px 3px 6px #00000040;
            background-color: var(--accent-color-full);

            overflow-y: auto;
            overscroll-behavior: contain;

            z-index: 10;
        }

        .section-title {
            font-size: 14px;
            height: 30px;
            margin-left: 10px;

            display: flex;
            align-items: center;
        }

        .option {
            font-weight: 400;
            text-transform: capitalize;

            padding: 0 20px;
            width: auto;
            height: 30px;

            white-space: nowrap;

            display: flex;
            align-items: center;
        }

        .label {
            text-transform: capitalize;
            flex: auto;
        }

        .option:hover,
        .option.selected {
            cursor: pointer;
            color: var(--dropdown-compact-hover-color, inherit);
            background: #666;
        }
    `;
}
