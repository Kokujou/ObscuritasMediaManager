import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg';
import { saveTickIcon } from '../../resources/inline-icons/general/save-tick-icon.svg';

export function renderOfflineMusicImportPageStyles() {
    return css`
        :host {
            height: 100%;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        #import-panel {
            padding: 30px;
            border-radius: 20px;

            gap: 30px;

            background: #0005;
            backdrop-filter: blur(20px);

            box-shadow: 0 0 20px black, 0 0 20px black;
        }

        #caption {
            font-size: 36px;
            font-weight: bold;
        }

        #description,
        #offline-mode-text {
            max-width: 400px;
        }

        #import-states {
            gap: 10px;
            width: 100%;
        }

        .import-status {
            align-items: center;
            width: 100%;
            gap: 20px;
        }

        .import-status label {
            min-width: 100px;
        }

        custom-toggle {
            --untoggled-color: red;
            --toggled-color: green;
            --slider-color: #0009;
            pointer-events: none;
        }

        .delete-action,
        .validate-action {
            width: 30px;
            height: 30px;

            background: white;

            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
        }

        .delete-action {
            ${renderMaskImage(trashIcon())};
        }

        .validate-action {
            ${renderMaskImage(saveTickIcon())};
        }

        #offline-mode-text {
            color: var(--warning-color);
        }

        #submit-button {
            align-self: center;
        }

        #actions {
            gap: 20px;
            justify-content: center;
        }
    `;
}
