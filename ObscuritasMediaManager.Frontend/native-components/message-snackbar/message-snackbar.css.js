import { css } from '../../exports.js';

export function renderMessageSnackbarStyles() {
    return css`
        :host {
            width: 300px;
            position: fixed;
            right: 50px;
            border-radius: 10px;
            padding: 10px;

            display: flex;
            flex-direction: row;

            transition: top 0.3s linear;
        }

        #x-button {
            cursor: pointer;
        }
    `;
}
