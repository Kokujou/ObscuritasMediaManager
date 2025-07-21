import { css } from 'lit-element';

export function renderImportFoodPageStyles() {
    return css`
        #page {
            background-color: #0005;
            width: 100%;
            height: 100%;
            padding: 30px;
            box-sizing: border-box;

            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        #current-image {
            min-height: 80%;
            height: 80%;
            max-height: 80%;
            width: auto;
            max-width: 70%;
            min-width: 0;
            object-fit: contain;
        }

        #other-images-container {
            position: relative;

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 30px;

            padding: 20px 0;
            max-width: 80%;
            overflow-x: auto;
        }

        .imported-image {
            height: 100%;
            width: auto;
            object-fit: contain;
        }
    `;
}
