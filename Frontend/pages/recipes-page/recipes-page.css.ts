import { css } from 'lit-element';

export function renderRecipesPageStyles() {
    return css`
        page-layout {
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: column;
        }

        #filter-area {
        }

        paginated-scrolling {
            position: absolute;
            inset: 0;

            overflow-y: auto;
            overflow-x: hidden;

            font-weight: bold;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        #items {
            margin: 100px 50px 0 50px;
            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        #add-recipe-icon {
            background: gray;
            box-sizing: border-box;
        }

        .recipe-tile {
            min-width: 300px;
            width: 300px;
            min-height: 300px;
            height: 300px;
            --font-size: 30px;

            cursor: pointer;
        }
    `;
}
