import { css } from 'lit-element';

export function renderImportFoodPageStyles() {
    return css`
        #page {
            width: 100%;
            height: 100%;
            padding: 30px;
            box-sizing: border-box;

            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        #current-image-editor {
            position: relative;
            min-height: 100%;
            height: 100%;
            max-height: 100%;
            width: 100%;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #000;
        }

        #edit-image-sidebar {
            width: 30%;
            height: 100%;
            padding: 50px;
            box-sizing: border-box;

            font-size: 18px;
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        #food-name {
            font-size: 24px;
        }

        #food-description {
            background: transparent;
            border: none;
            outline: none;
            font: inherit;
            color: inherit;
            border-bottom: 2px solid;
            padding: 10px;
        }

        #tags {
            display: flex;
            flex-direction: row;
            gap: 20px;
            flex-wrap: wrap;
        }

        tag-label {
            font-size: 16px;
            --tag-label-min-width: 100px;
        }

        #current-image {
            width: auto;
            height: 100%;
            width: 70%;
            object-fit: contain;
        }

        side-scroller {
            position: absolute;
            bottom: 0;
            left: 40px;
            height: 20%;
            width: calc(70% - 40px * 2);
            font-size: 40px;

            min-height: 0;
            --side-scroller-gap: 30px;
            --side-scroller-padding-inner: 40px 0;
        }

        .imported-image-container {
            position: relative;
            height: 100%;
        }

        .imported-image-container[current] {
            outline: 5px solid blue;
            transform: scale(1.3);
        }

        .imported-image {
            height: 100%;
            width: auto;
            aspect-ratio: 1;
            object-fit: contain;

            transition: transform 0.2s linear;

            background: black;

            cursor: pointer;
        }

        .remove-image-icon {
            position: absolute;
            top: 0;
            right: 0;
            width: 25px;
            height: 25px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;
            background: gray;
            font-size: 24px;
            z-index: 5;

            user-select: none;
            cursor: pointer;
        }

        .remove-image-icon:hover {
            background: red;
        }

        .arrow-link {
            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;
            min-width: 30px;

            user-select: none;
            cursor: pointer;
        }

        .arrow-link[disabled] {
            filter: brightness(0.6);
            cursor: default;
            pointer-events: none;
        }
    `;
}
