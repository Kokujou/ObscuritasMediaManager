import { css } from '../../exports.js';

export function renderOrderedListStyles() {
    return css`
        #list {
            position: absolute;
            inset: 0;
            font: inherit;

            overflow-y: auto;
            overflow-x: hidden;

            display: flex;
            flex-direction: column;

            scrollbar-width: thin;
        }

        .row {
            display: flex;
            flex-direction: row;
            gap: 20px;

            padding: 10px 20px;
        }

        .row:hover {
            background: #5555;
        }

        .row:active {
            background: #8888;
        }

        .row[dragTarget] {
            border-top: 5px solid purple;
        }

        .row[active] {
            background: #aaaa;
        }
    `;
}
