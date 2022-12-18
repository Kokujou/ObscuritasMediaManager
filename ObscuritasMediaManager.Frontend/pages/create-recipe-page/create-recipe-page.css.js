import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { css } from '../../exports.js';

export function renderCreateRecipePageStyles() {
    return css`
        page-layout {
            position: absolute;
            inset: 0;
            font-size: 18px;
        }

        #create-recipe-form {
            display: flex;
            flex-direction: column;
            margin: 50px;
            max-width: 100%;
        }

        #title {
            display: flex;
            font-size: 36px;
            margin-bottom: 50px;
        }

        #image-ingredients-container {
            display: flex;
            flex-direction: row;
        }

        #ingredient-container {
            min-height: 500px;
            flex: auto;
            margin-right: 50px;
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

            padding: 20px;
            margin-bottom: 20px;

            border-bottom: 1px solid;
        }

        .group-title {
            font-size: 24px;
            align-self: flex-start;
        }

        .ingredient {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;

            font-weight: bold;
        }

        .ingredient-amount {
            max-width: 150px;
        }

        .ingredient-unit {
            max-width: 150px;
        }

        #add-ingredient-link,
        #add-group-link {
            font-weight: bold;
            cursor: pointer;
        }

        #add-ingredient-link:hover,
        #add-group-link:hover {
            text-decoration: underline;
            text-underline-offset: 8px;
        }

        #image-container {
            position: relative;
            background: black;

            width: 500px;
            min-width: 500px;
            height: 500px;
            min-height: 500px;
            top: 0;
            right: 0;
        }

        #rating {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        #difficulty {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
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

        ${renderLanguageFlags()}

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
            width: 200px;
        }

        editable-label {
            --text-padding: 5px 10px;
            --label-height: 25px;
            max-width: 300px;
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
