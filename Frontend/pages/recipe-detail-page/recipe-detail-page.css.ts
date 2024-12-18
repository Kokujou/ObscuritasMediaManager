import { css } from 'lit-element';

export function renderRecipeDetailPageStyles() {
    return css`
        page-layout {
            position: absolute;
            inset: 0;
            font-size: 18px;
        }

        #page-container {
            position: absolute;
            inset: 0;
            border-radius: 50px;
            margin-left: 10px;
            overflow: hidden;

            background: #222;
        }

        #create-recipe-form {
            position: absolute;
            inset: 10px;
            top: 25px;
            bottom: 25px;
            padding: 25px;
            margin: 0 !important;
            display: flex;
            flex-direction: column;

            overflow-y: scroll;
            overflow-x: hidden;
            scrollbar-width: thin;
        }

        #title {
            display: inline-flex;
            font-size: 36px;
            margin-bottom: 50px;
            max-width: 800px;
            width: 800px;
            flex: unset;
            --label-height: auto;
        }

        #image-ingredients-container {
            display: flex;
            flex-direction: row;
        }

        #ingredient-container {
            display: flex;
            flex-direction: column;

            min-height: 500px;
            flex: auto;
            margin-right: 10px;
        }

        #ingredients-section-title {
            font-size: 30px;
        }

        #measurement-config-area {
            display: flex;
            flex-direction: row;
        }

        .ingredient-group {
            display: flex;
            flex-direction: column;
            gap: 10px;

            margin-bottom: 20px;
        }

        .group-title {
            font-size: 24px !important;
            align-self: flex-start;
            min-width: 100% !important;
        }

        .ingredient {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;

            flex: auto;

            font-weight: bold;
        }

        .ingredient-amount {
            max-width: 75px !important;
        }

        .ingredient-unit {
            min-width: 150px;
        }

        #add-ingredient-link,
        #add-group-link {
            font: inherit;
            font-weight: bold;
            cursor: pointer;
            background: none;
            border: none;
            color: inherit;
            align-self: flex-start;
        }

        #add-ingredient-link:hover,
        #add-group-link:hover {
            text-decoration: underline;
            text-underline-offset: 8px;
        }

        .ingredient-description {
            flex: auto;
        }

        recipe-tile {
            --recipe-tile-width: 400px;
            --recipe-tile-min-height: 400px;
            --font-size: 45px;
        }

        #description-area {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 50px;
            margin-bottom: 50px;
        }

        .description-section {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        .description-input {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;

            font-weight: bold;
            text-shadow: 2px 2px 2px black;
        }

        drop-down {
            background: transparent;
            width: 300px;
        }

        input[type='text'] {
            padding: 10px 10px;
            --icon-size: 25px;
            width: 300px;

            background: transparent;
            color: inherit;
            font: inherit;
            border: none;
            outline: none;
            border-bottom: 1px solid;

            overflow: auto;
            scrollbar-width: none;
        }

        #recipe-text {
            border: none;
            outline: none;
            background: lightgray;
            font-size: 18px;
            min-height: 200px;
            margin-bottom: 50px;
        }
    `;
}
