import { css } from '../../exports.js';

export function renderSelectOptionsDialogStyles() {
    return css`
        #content {
            display: flex;
            flex-direction: column;
            justify-content: center;

            max-height: 300px;
            overflow-y: auto;
        }

        .option {
            margin: 10px 0;
            width: 100%;
        }

        label {
            width: 100%;
        }
    `;
}
