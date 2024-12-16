import { css } from 'lit-element';

export function renderRecipesPageStyles() {
    return css`
        #page {
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: row;
            align-items: flex-start;
        }

        paginated-scrolling {
            flex: auto;
            align-self: stretch;

            overflow-y: auto;
            overflow-x: hidden;

            font-weight: bold;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        #items {
            margin: 50px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 50px;
        }

        .recipe-tile {
            --recipe-tile-width: 300px;
            --recipe-tile-min-height: 300px;
            --font-size: 30px;

            cursor: pointer;
        }

        #search-panel-container {
            width: 400px;
            max-height: 100%;
            padding: 0 20px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background-color: var(--accent-color);
            border-radius: 20px;
            overflow: hidden;
        }

        recipe-filter {
            width: 400px;
        }

        #add-recipe-icon {
            background: gray;
            box-sizing: border-box;
        }
    `;
}
