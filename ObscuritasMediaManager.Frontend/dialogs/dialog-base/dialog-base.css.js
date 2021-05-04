import { css } from '../../exports.js';

export function renderDialogBaseStyles() {
    return css`
        #dialog-outer {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            font-family: Arial, Helvetica, sans-serif;
            color: lightgray;
            user-select: none;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        #dialog-border {
            padding: 10px;
            border: 1px solid #333355;
            border-radius: 20px;
        }

        #dialog-container {
            display: flex;
            flex-direction: column;
            background-color: #333355;
            border-radius: 20px;
            padding: 30px;
        }

        #dialog-content {
            margin: 20px;
        }

        #dialog-title {
            font-size: 48px;
            margin-bottom: 20px;
        }

        #dialog-actions {
            display: inline-flex;
            flex-direction: row;
            margin-top: 20px;
            position: relative;
            justify-content: flex-end;
        }

        #dialog-actions > * {
            margin-right: 40px;
        }

        #dialog-actions > :last-child {
            margin-right: 0;
        }
    `;
}
