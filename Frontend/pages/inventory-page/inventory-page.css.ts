import { css } from 'lit-element';

export function renderInventoryPageStyles() {
    return css`
        #container-section {
            justify-content: space-between;
            align-items: flex-start;
        }

        inventory-container {
            width: 550px;
        }

        .add-button {
            font-size: 100px;
            font-weight: bold;

            padding: 20px;
            width: 100px;

            background: black;
            border-radius: 20px;

            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
    `;
}
