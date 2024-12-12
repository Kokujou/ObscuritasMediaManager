import { css } from 'lit-element';

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

            margin-right: 20px;
            transition: top 0.3s linear;
        }

        #x-button {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }
    `;
}
