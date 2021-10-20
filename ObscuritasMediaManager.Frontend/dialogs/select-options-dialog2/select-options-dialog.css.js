import { css } from '../../exports.js';

export function renderSelectOptionsDialogStyles() {
    return css`
        #content {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .option {
            margin: 10px 0;
        }
    `;
}
