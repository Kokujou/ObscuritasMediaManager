import { css } from 'lit';

export function renderInventoryPageStyles() {
    return css`
        #inventory-page {
            align-items: center;
        }

        inventory-container {
            width: 80%;
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
