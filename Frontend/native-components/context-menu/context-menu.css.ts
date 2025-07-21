import { css } from 'lit-element';

export function renderContextMenuStyles() {
    return css`
        :host {
            position: fixed;
            box-shadow: 2px 2px 2px black;
            z-index: 1;
            background: var(--accent-color-full);
            min-width: 200px;
            overflow-y: auto;
            color: white;
        }

        .item-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            gap: 20px;
            padding: 5px 10px;
        }

        .item-wrapper:hover {
            background: gray;
        }

        .item-wrapper:active {
            background: darkgray;
        }

        .item-icon {
            width: 35px;
            height: 35px;
            background: white;
        }

        .item-text {
            flex: auto;
        }
    `;
}
