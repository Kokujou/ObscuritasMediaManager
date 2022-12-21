import { css } from '../../exports.js';
import { plusIcon } from '../../resources/icons/general/plus-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

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

            display: flex;
            flex-direction: column;
            align-items: stretch;
            flex: auto;

            overflow-y: auto;
            overflow-x: hidden;

            font-weight: bold;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        #items {
            margin: 100px 50px 0 50px;
            display: flex;
            flex-direction: row;
        }

        #add-recipe-icon {
            width: 200px;
            height: 200px;

            cursor: pointer;

            background: gray;
            ${renderMaskImage(plusIcon())};
        }

        .recipe-tile {
            width: 200px;
            height: 200px;

            cursor: pointer;
        }
    `;
}
