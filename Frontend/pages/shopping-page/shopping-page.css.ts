import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { revertIcon } from '../../resources/inline-icons/general/revert-icon.svg';

export function renderShoppingPageStyles() {
    return css`
        table {
            width: calc(100% - 40px);
            border-collapse: collapse;
            border-spacing: 0;
            margin: 10px 20px;
            border-radius: 15px;
            box-shadow: 0 0 0 2px white;

            background: var(--accent-color);
        }

        #filter-header {
            padding: 0 20px;
            justify-content: space-between;
        }

        #filter-header,
        .filter {
            font-weight: bold;

            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .filter {
            gap: 20px;
        }

        .filter drop-down {
            min-width: 150px;
        }

        #search-input {
            width: 300px;
        }

        .reset-filters-icon {
            width: 30px;
            height: 30px;

            background: white;

            cursor: pointer;

            ${renderMaskImage(revertIcon())};
        }

        #create-ingredient-link {
            display: inline;
            font-weight: bold;
            text-decoration: underline;
            padding: 10px 30px;

            cursor: pointer;
        }

        tr {
            box-shadow: inset 0 -1px 0 0 white;
        }

        tr[new] {
            background: #ff02;
        }

        tr[favorite] {
            background: #0f02;
        }

        .table-head-cell td {
            font-weight: bold;
        }

        td {
            padding: 10px 20px;
            height: 60px;
        }

        tbody > tr:last-of-type {
            box-shadow: none;
        }

        input {
            background: none;
            outline: none;
            border: none;
            font-style: inherit;
            font-weight: inherit;
            font-size: inherit;
            color: inherit;

            padding: 10px;
            border-bottom: 2px solid;
            width: 100%;
            box-sizing: border-box;
        }

        .ingredient-price {
            width: 80px;
        }

        .ingredient-measurement {
            width: 80px;
        }

        .ingredient-category {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
            width: 150px;
        }

        .ingredient-category-icon {
            background: white;
            width: 25px;
            height: 25px;
            margin: 2px;

            cursor: pointer;
        }

        .ingredient-category-icon-wrapper:focus {
            border: 2px dashed;
            outline: none;
        }

        .ingredient-nation {
            width: 120px;
        }

        .icon {
            width: 20px;
            height: 20px;
            background: white;
        }

        .action-icon {
            width: 25px;
            height: 25px;
            background: white;

            cursor: pointer;
        }

        .action-icon:hover,
        tr[favorite] .action-icon {
            background: yellow;
        }

        .shop-icons {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }

        .shop-icon {
            width: 35px;
            height: 35px;
            background: white;
            border-radius: 5px;
        }
    `;
}
