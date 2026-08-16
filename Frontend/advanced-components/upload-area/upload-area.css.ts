import { css } from 'lit';

export function renderUploadAreaStyles() {
    return css`
        :host {
            position: relative;
            flex: auto;
            cursor: pointer;
            display: flex;
        }

        #image-container {
            position: relative;
            flex: auto;

            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center;

            margin: 20px;
            display: flex;
            flex-direction: row;
            pointer-events: none;
        }

        .image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            transform-origin: 50% 50%;
            pointer-events: all;
        }

        .image:first-of-type {
            object-fit: contain;
        }

        #add-icon {
            opacity: 1;
            pointer-events: all;
            position: absolute;
            inset: 20px;
            z-index: 1;
        }

        .icon {
            background-color: #bbbbbb77;
        }

        #image-container:focus-within,
        #image-container:focus,
        #image-container.focus {
            background: #0007;
            transition:
                background-color,
                ease 1s;
        }

        #image-container:focus-within #add-icon,
        #image-container:focus #add-icon,
        #image-container.focus #add-icon {
            opacity: 0;
            pointer-events: none;
        }

        #image-container:focus-within #upload-description,
        #image-container:focus #upload-description,
        #image-container.focus #upload-description {
            opacity: 1;
            pointer-events: all;
            border-color: #553355;
        }

        #image-container #upload-description {
            opacity: 0;
            pointer-events: none;
        }

        #upload-description {
            display: flex;
            flex-direction: column;

            padding: 10px;

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
        }

        #upload-description #icon-section {
            display: flex;
            flex-direction: row;
            height: 50px;
            margin-bottom: 20px;
        }

        #upload-description #icon-section > * {
            flex: auto;
            align-items: center;
        }

        #upload-description #brose-files-link {
            color: var(--font-color);
            font-weight: bold;
            text-shadow: 2px 2px 2px black;
        }

        #image-container > * {
            transition: opacity ease 1s;
            user-select: none;
            -webkit-user-select: none;
            caret-color: transparent;
        }
    `;
}
