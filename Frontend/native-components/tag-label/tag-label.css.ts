import { css } from 'lit';

export function renderTagLabelStyles() {
    return css`
        :host {
            display: inline-block;
            user-select: none;
            -webkit-user-select: none;
        }

        #label-container {
            position: relative;
            padding-left: 10px;
            background: var(--label-color);

            border-radius: 20px 500em 500em 20px;

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

        #new-label-form,
        #new-tag-input,
        #label-text {
            color: inherit;
            min-width: 30px;
            padding: 2px;
            margin-right: 5px;
            font-size: inherit;
        }

        #new-tag-input {
            border: none;
            background-color: inherit;
            outline: none;
            border-bottom: 2px solid black;
            width: 100%;
            min-width: var(--tag-label-min-width, unset);
            padding: 0 !important;
            font-family: inherit;
        }

        #invisible-text {
            opacity: 0;
            height: 2px;
            white-space: nowrap;
        }

        #x-button {
            border-radius: 50%;
            margin: 3px;
            margin-left: 0;
            width: 15px;
            height: 15px;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--label-color) 0% 100%);
            cursor: pointer;

            display: flex;
            justify-content: center;
            align-items: center;

            font-size: 12px;
            color: lightgray;
        }

        :host([disabled]) #x-button {
            pointer-events: none;
            display: none;
        }

        #autocomplete-list {
            position: absolute;
            top: 100%;
            left: 0;

            background: var(--label-color);
            z-index: 1;

            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            box-shadow: 0 0px 3px black;
        }

        #autocomplete-list.hidden {
            display: none;
        }

        #autocomplete-list #item-container {
            display: flex;
            flex-direction: column;
        }

        #autocomplete-list .autocomplete-item {
            display: flex;
            align-items: center;
            padding: 5px;
            padding-right: 30px;
            white-space: nowrap;
        }

        #autocomplete-list .autocomplete-item.active {
            background: #fff5;
        }
    `;
}
