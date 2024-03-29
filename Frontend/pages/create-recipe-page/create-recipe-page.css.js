import { css } from '../../exports.js';

export function renderCreateRecipePageStyles() {
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
            --label-height: auto;
        }

        #image-ingredients-container {
            display: flex;
            flex-direction: row;
        }

        #ingredient-container {
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
            gap: 10px;

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

        #image-container {
            position: relative;

            width: 500px;
            min-width: 500px;
            height: 500px;
            min-height: 500px;
            top: 0;
            right: 0;

            display: flex;
            align-items: center;
        }

        #image {
            position: absolute;
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;

            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;

            cursor: pointer;
        }

        #image:not(:hover)[set] upload-area {
            display: none;
            pointer-events: none;
        }

        #image[set]:hover upload-area {
            background: #0006;
        }

        upload-area {
            position: absolute;
            width: 100%;
            height: 100%;
            margin: 0;
            border-radius: 20px;
        }

        #rating {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);

            filter: drop-shadow(5px 5px 5px black);
        }

        #difficulty {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            filter: drop-shadow(5px 5px 5px black);
        }

        #nation-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 100px;
            height: 100px;
            border-radius: 50%;

            cursor: pointer;
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
            max-width: 300px;
            width: 300px;

            background: transparent;
            color: inherit;
            font: inherit;
            border: none;
            border-bottom: 1px solid;

            overflow: auto;
            scrollbar-width: none;
            flex: auto;
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
