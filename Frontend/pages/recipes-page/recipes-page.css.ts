import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { addDishIcon } from '../../resources/inline-icons/general/add-dish-icon.svg';
import { addRecipeIcon } from '../../resources/inline-icons/general/add-recipe-icon.svg';

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

        .add-icon {
            width: 100px;
            height: 100px;
            box-sizing: border-box;
            margin: 20px;

            background: gray;
            cursor: pointer;
        }

        link-element:hover .add-icon {
            transform: scale(1.25);
        }

        #add-recipe-icon {
            ${renderMaskImage(addRecipeIcon())};
        }

        #add-dish-icon {
            ${renderMaskImage(addDishIcon())};
        }

        .recipe-tile {
            --recipe-tile-width: 300px;
            --recipe-tile-min-height: 300px;
            --font-size: 18px;

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
            border-radius: 15px;
            overflow: hidden;
        }

        recipe-filter {
            width: 400px;
        }
    `;
}
