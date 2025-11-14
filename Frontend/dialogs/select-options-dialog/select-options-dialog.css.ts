import { css } from 'lit';

export function renderSelectOptionsDialogStyles() {
    return css`
        #content {
            max-height: 300px;
            overflow-y: auto;
        }

        #items {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .option {
            display: flex;
            flex-direction: row;
            margin: 10px 0;
            width: 100%;
        }

        label {
            width: 100%;
        }

        link-element:hover {
            text-decoration: underline;
        }

        loading-circle {
            width: 50px;
            height: 50px;
            align-self: center;
        }
    `;
}
