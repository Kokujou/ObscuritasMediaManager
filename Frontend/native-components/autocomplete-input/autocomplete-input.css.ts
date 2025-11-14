import { css } from 'lit';

export function renderAutocompleteInputStyles() {
    return css`
        :host {
            position: relative;
            display: inline-block;
        }

        input {
            border: none;
            outline: none;
            font: inherit;
            color: inherit;
            background: inherit;
            width: 100%;
            box-sizing: border-box;

            border-bottom: 2px solid !important;
            padding: 10px;
        }

        #dropdown {
            position: absolute;
            top: 100%;
            min-width: 100%;
            z-index: 1;

            display: flex;
            flex-direction: column;

            color: var(--font-color);
            box-shadow: 0px 3px 6px #00000040;
            background-color: var(--accent-color-full);

            overflow-y: auto;
            overscroll-behavior: contain;
        }

        .option {
            padding: 10px;
            user-select: none;
        }

        .option[focused],
        .option:hover {
            background: gray;
        }

        .option[selected] {
            font-weight: bold;
        }
    `;
}
