import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { saveTickIcon } from '../../resources/inline-icons/general/save-tick-icon.svg';

export function renderImportFoodPageStyles() {
    return css`
        :host {
            outline: none;
        }

        #page {
            width: 100%;
            height: 100%;
            padding: 30px;
            border-radius: 20px;
            box-sizing: border-box;

            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            background: #0009;
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
        }

        #edit-image-sidebar {
            width: 30%;
            height: 100%;
            max-height: 100%;
            padding: 50px;
            box-sizing: border-box;
            overflow-y: auto;

            font-size: 18px;
            display: flex;
            flex-direction: column;
            gap: 30px;
        }

        #food-name {
            font-size: 16px;
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

        #current-image-background {
            flex: auto;
            display: flex;
            align-items: center;
            justify-content: center;

            width: 70%;
            height: 100%;
        }

        #current-image-container {
            position: relative;
            max-height: 100%;
            max-width: 70%;
            user-select: none;

            display: inline-block;
        }

        #cache-loading-indicator {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);

            top: 20px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 20px;

            filter: drop-shadow(0 0 3px pink) drop-shadow(0 0 10px #fff9);
        }

        partial-loading {
            width: 50px;
            height: 50px;
            filter: drop-shadow(0 0 1px black);
        }

        .loading-text {
            font-size: 14px;
            font-weight: bold;
            color: black;
            text-shadow: 0 0 2px #505, 0 0 2px #505;
        }

        side-scroller {
            position: absolute;
            bottom: 0;
            left: 40px;
            height: 20%;
            width: calc(70% - 40px * 2);
            font-size: 16px;

            user-select: none;

            min-height: 0;
            --side-scroller-gap: 30px;
            --side-scroller-padding-inner: 40px 0;
        }

        #file-count {
            position: absolute;
            bottom: 10px;
            left: 200px;
            color: white;
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
            font-size: 16px;
            z-index: 5;

            user-select: none;
            cursor: pointer;
        }

        .remove-image-icon:hover {
            background-color: red;
            transition: background-color 0.5s ease-out;
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

        #finish-import-button {
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 20px;
            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            background: green;
            box-shadow: 0 0 20px green;
            cursor: pointer;
        }

        #finish-import-button:hover {
            scale: 1.2;
            transition: scale 0.2s ease-out;
        }

        #finish-import-icon {
            width: 50px;
            height: 50px;
            background: white;

            ${renderMaskImage(saveTickIcon())};
        }
    `;
}
