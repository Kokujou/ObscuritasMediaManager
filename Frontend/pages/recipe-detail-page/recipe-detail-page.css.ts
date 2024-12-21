import { css } from 'lit-element';

export function renderRecipeDetailPageStyles() {
    return css`
        page-layout {
            font-size: 18px;
        }

        #page-container {
            width: 100%;
            border-radius: 50px;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;

            display: inline-flex;
            flex-direction: column;
        }

        #image-ingredients-container {
            display: flex;
            flex-direction: row;
            gap: 30px;
        }

        #ingredient-container {
            display: flex;
            flex-direction: column;

            min-height: 300px;
            flex: auto;
            padding: 20px;
            border-radius: 20px;
            box-sizing: padding-box;

            background: var(--accent-color);
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
            padding: 20px;
            border-radius: 20px;

            background: var(--accent-color);
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
            box-sizing: border-box;

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
            min-height: 200px;
            margin-bottom: 50px;
            border-radius: 20px;
            padding: 10px;
            border: 3px dashed;

            background: var(--accent-color-full);
            font: inherit;
            color: inherit;
            font-size: 18px;
        }

        #action-area {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .action-button {
            padding: 25px 50px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(130deg, transparent 0 20%, #fff5, transparent 40% 90%), #0009;

            box-shadow: 0 0 10px white inset, 0 0 20px #440055, 0 0 20px #440055, 0 0 20px #440055;
            text-shadow: 0 0 10px black;

            font-size: 30px;
            color: lightgray;

            cursor: pointer;
        }

        .action-button:hover {
            background: linear-gradient(130deg, transparent 0 20%, #fff8, transparent 40% 90%), #3039;
        }
    `;
}
