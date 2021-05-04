import { css } from '../../exports.js';

export function renderTagLabelStyles() {
    return css`
        :host {
            --label-color: #883377;
            display: inline-block;
            user-select: none;
        }

        #label-container::before {
            content: ' ';
            position: absolute;
            right: calc(100% - 15px);
            width: 30px;
            height: 100%;
            z-index: -1;

            border-top-left-radius: 50%;
            border-bottom-left-radius: 50%;

            background-color: var(--label-color);
        }

        #label-container {
            position: relative;
            margin-left: 15px;
            background-color: var(--label-color);

            display: flex;
            flex-direction: row;
            color: white;

            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;

            align-items: center;
        }

        #new-label-form {
            display: flex;
            flex-direction: column;
            width: min-content;
            margin: 0 !important;
        }

        #new-tag-input {
            border: none;
            background-color: inherit;
            outline: none;
            border-bottom: 1px solid black;
            width: 100%;
            padding: 0 !important;
            font-family: inherit;
        }

        #new-label-form,
        #new-tag-input,
        #label-text {
            color: inherit;
            min-width: 30px;
            padding: 5px;
            font-size: 12px;
        }

        #invisible-text {
            opacity: 0;
            height: 1px;
            white-space: nowrap;
        }

        #x-button {
            border-radius: 50%;
            margin: 5px;
            width: 15px;
            height: 15px;
            background: #cc77bb;
            cursor: pointer;

            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 18px;
            color: lightgray;
        }
    `;
}
