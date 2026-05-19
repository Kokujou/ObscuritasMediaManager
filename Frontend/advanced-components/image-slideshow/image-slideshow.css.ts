import { css } from 'lit';

export function renderImageSlideshowStyles() {
    return css`
        :host {
            outline: none;

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
            -webkit-user-select: none;

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
            text-shadow:
                0 0 2px #505,
                0 0 2px #505;
        }

        side-scroller {
            position: absolute;
            bottom: 0;
            left: 40px;
            height: 25%;
            width: calc(70% - 40px * 2);
            font-size: 16px;

            user-select: none;
            -webkit-user-select: none;

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
            width: 15px;
            height: 15px;

            display: flex;
            align-items: center;
            justify-content: center;

            border-radius: 50%;
            background: gray;
            font-size: 16px;
            z-index: 5;

            user-select: none;
            -webkit-user-select: none;
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
            -webkit-user-select: none;
            cursor: pointer;
        }

        .arrow-link[disabled] {
            filter: brightness(0.6);
            cursor: default;
            pointer-events: none;
        }
    `;
}
