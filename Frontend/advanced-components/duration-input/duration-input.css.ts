import { css } from 'lit-element';

export function renderDurationInputStyles() {
    return css`
        :host {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            color: white;
            font-size: 18px;
            font-weight: bold;

            border-bottom: 2px solid;
        }

        input {
            width: 30px;
            font-size: inherit;
            font-weight: inherit;
            text-align: center;

            background: none;
            border: none;
            outline: none;
            color: white;

            user-select: auto !important;
        }
    `;
}
