import { css } from '../../exports.js';

export function renderContextMenuStyles() {
    return css`
        :host {
            position: fixed;
            box-shadow: 1px 1px 1px black;
            z-index: 1;
            background: white;
            min-width: 200px;
            color: black;
        }

        .item-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            gap: 20px;
            padding: 10px;
        }

        .item-wrapper:hover {
            background: gray;
        }

        .item-wrapper:active {
            background: darkgray;
        }

        .item-icon {
            width: 25px;
            height: 25px;
            background: black;
        }

        .item-text {
            flex: auto;
        }
    `;
}
