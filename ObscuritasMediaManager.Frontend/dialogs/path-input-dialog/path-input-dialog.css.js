import { css } from '../../exports.js';

export function renderPathInputDialogStyles() {
    return css`
        #dialog-content {
            display: flex;
            flex-direction: column;
            font-size: 18px;
        }

        input {
            background: none;
            font-size: 18px;
            color: inherit;

            margin-top: 10px;
            padding: 10px;
            width: 100%;

            outline: none;
            border: none;
            border-bottom: 1px solid white;
        }
    `;
}
