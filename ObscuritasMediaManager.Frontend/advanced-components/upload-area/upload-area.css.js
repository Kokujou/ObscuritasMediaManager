import { css, unsafeCSS } from '../../exports.js';
import { plusIcon } from '../../resources/icons/plus-icon.svg.js';
import { clipboardIcon } from './images/clipboard-icon.svg.js';
import { dropIcon } from './images/drop-icon.svg.js';

export function renderUploadAreaStyles() {
    return css`
        :host {
            position: relative;
            flex: auto;
            cursor: pointer;

            display: flex;
        }

        .image-container {
            position: relative;
            flex: auto;
            cursor: pointer;

            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center;

            margin: 20px;
            display: flex;
            flex-direction: row;
        }

        .add-icon {
            opacity: 1;
            pointer-events: all;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;

            mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(plusIcon(true)))}');
            -webkit-mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(plusIcon(true)))}');
        }

        .icon {
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
            background-color: #bbbbbb77;
        }

        .image-container:focus-within .add-icon,
        .image-container.focus .add-icon {
            opacity: 0;
            pointer-events: none;
        }

        .image-container:focus-within .upload-description,
        .image-container.focus .upload-description {
            opacity: 1;
            pointer-events: all;
        }

        .image-container .upload-description {
            opacity: 0;
            pointer-events: none;
        }

        .upload-description:focus-within {
            border-color: #553355;
        }

        .upload-description {
            display: flex;
            flex-direction: column;

            padding: 10px;
            margin-right: 60px;

            opacity: 1;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;

            border: 2px dashed lightgray;
            border-radius: 15px;

            color: lightgray;
            text-align: center;
            font-size: 18px;
            user-select: none;
        }

        .upload-description .icon-section {
            display: flex;
            flex-direction: row;
            height: 50px;
            margin-bottom: 20px;
        }

        .upload-description .icon-section > * {
            flex: auto;
            align-items: center;
        }

        .upload-description .brose-files-link {
            color: lightseagreen;
            font-weight: bold;
            text-shadow: 1px 1px 1px black;
        }

        .image-container > * {
            transition: opacity ease 1s;
            user-select: none;
            caret-color: transparent;
        }

        .clipboard-icon {
            mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(clipboardIcon()))}');
            -webkit-mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(clipboardIcon()))}');
        }

        .drop-icon {
            mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(dropIcon()))}');
            -webkit-mask-image: url('data: image/svg+xml;base64,${unsafeCSS(btoa(dropIcon()))}');
        }
    `;
}