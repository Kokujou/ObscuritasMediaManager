import { css } from 'lit';

export function renderDialogBaseStyles() {
    return css`
        #dialog-outer {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            font-family: Arial, Helvetica, sans-serif;
            color: #ddd;
            user-select: none;
            -webkit-user-select: none;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        #dialog-border:not([invisible]),
        :host([showBorder]) #dialog-border {
            padding: 5px;
            border: 3px solid #333;
            border-radius: 20px;
        }

        #dialog-container {
            position: relative;
            display: flex;
            flex-direction: column;
            background-color: #222;
            border-radius: 20px;
            padding: 30px;
            z-index: 0;
        }

        #x-button {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 18px;
            cursor: pointer;
        }

        #dialog-content,
        #dialog-text {
            white-space: pre-line;
            position: relative;
            margin: 20px;
            font-size: 16px;
        }

        #dialog-text {
            max-width: 600px;
        }

        #dialog-title {
            font-size: 18px;
            margin: 0 40px;
            margin-bottom: 20px;
        }

        #dialog-actions {
            display: inline-flex;
            flex-direction: row;
            margin-top: 20px;
            position: relative;
            justify-content: flex-end;
            font-size: 16px;
        }

        #dialog-actions > * {
            margin-right: 40px;
        }

        #dialog-actions > :last-child {
            margin-right: 0;
        }
    `;
}
