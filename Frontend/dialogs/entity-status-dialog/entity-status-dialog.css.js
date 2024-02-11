import { css, unsafeCSS } from '../../exports.js';
import { ModelCreationState } from '../../obscuritas-media-manager-backend-client.js';

export function renderEntityStatusDialogStyles() {
    return css`
        #entries {
            display: flex;
            flex-direction: column;
            font-size: 18px;

            max-height: 250px;
            overflow-y: scroll;
            overflow-x: hidden;

            scrollbar-width: thin;
        }

        .entry {
            display: flex;
            flex-direction: row;
            padding: 10px;
            min-width: 300px;
            gap: 30px;
        }

        .entry[status='${unsafeCSS(ModelCreationState.Success)}'] {
            background: #5f55;
        }

        .entry[status='${unsafeCSS(ModelCreationState.Updated)}'] {
            background: #55f5;
        }

        .entry[status='${unsafeCSS(ModelCreationState.Ignored)}'] {
            background: #ff07;
        }

        .entry[status='${unsafeCSS(ModelCreationState.Error)}'],
        .entry[status='${unsafeCSS(ModelCreationState.Invalid)}'] {
            background: #f555;
        }

        .entry-text {
            flex: auto;
            user-select: text;
        }

        #entries-loading-indication {
            min-width: 50px;
            min-height: 50px;
            max-width: 50px;
            max-height: 50px;
            align-self: center;
        }
    `;
}
