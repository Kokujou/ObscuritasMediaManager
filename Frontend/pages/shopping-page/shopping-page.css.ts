import { css } from 'lit-element';

export function renderShoppingPageStyles() {
    return css`
        table {
            width: calc(100% - 40px);
            border-collapse: collapse;
            border-spacing: 0;
            margin: 10px 20px;
            table-layout: fixed;
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

        #search-input {
            width: 300px;
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
            padding: 10px;
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
            width: 100px;
        }

        .ingredient-category {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
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
            width: 200px;
        }

        .icon {
            width: 20px;
            height: 20px;
            background: white;
        }

        .action-icon {
            width: 30px;
            height: 30px;
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
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 10px;
        }
    `;
}
