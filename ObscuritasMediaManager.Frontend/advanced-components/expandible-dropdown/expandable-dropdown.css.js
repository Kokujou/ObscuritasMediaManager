import { css } from '../../exports.js';

export function renderExpandableDropdownStyles() {
    return css`
        #result-filter {
            background-color: var(--accent-color);
            border-radius: 20px;
        }

        #filter-title {
            cursor: pointer;
            padding: 20px;
            font-size: 20px;
            display: flex;
            flex-direction: row;
        }

        #title-text {
            flex: auto;
        }

        #filter-title * {
            pointer-events: none;
        }

        #title-arrow {
            font-size: 18px;
            margin-left: 10px;
        }

        #result-filter.active #title-arrow {
            transform: rotate(180deg);
        }

        #filter-container {
            height: 0;

            transition: height 1s ease;
            overflow: hidden;
        }

        #result-filter.active #filter-container {
            height: 75px;

            transform: translateY(0);
        }
    `;
}
