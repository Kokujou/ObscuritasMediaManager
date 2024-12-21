import { css } from 'lit-element';

export function renderContextMenuStyles() {
    return css`
        :host {
            position: fixed;
            box-shadow: 1px 1px 1px black;
            z-index: 1;
            background: var(--accent-color-full);
            min-width: 200px;
            overflow-y: auto;
            color: white;

            scrollbar-width: thin;
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
            background: white;
        }

        .item-text {
            flex: auto;
        }
    `;
}
