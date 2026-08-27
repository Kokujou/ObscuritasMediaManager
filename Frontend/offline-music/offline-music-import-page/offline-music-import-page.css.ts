import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg';
import { saveTickIcon } from '../../resources/inline-icons/general/save-tick-icon.svg';

export function renderOfflineMusicImportPageStyles() {
    return css`
        #diagnostics {
            gap: 6px;
            width: 100%;
            padding-top: 8px;
            border-top: 1px solid #ffffff22;
        }

        /* the four status toggles above are display-only, hence pointer-events: none on
           custom-toggle - the diagnostic ones are actual switches and need it back */
        #diagnostics custom-toggle {
            pointer-events: auto;
            cursor: pointer;
        }

        #build-marker {
            font-size: 10px;
            opacity: 0.6;
        }

        #session-log {
            width: 100%;
            max-height: 40vh;
            overflow: auto;
            margin: 0;
            padding: 8px;
            background: #0006;
            border-radius: 4px;
            font-family: ui-monospace, monospace;
            font-size: 10px;
            line-height: 1.4;
            white-space: pre;
            -webkit-user-select: text;
            user-select: text;
        }

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

            box-shadow:
                0 0 20px black,
                0 0 20px black;
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

        .info *,
        .error * {
            display: inline-block;
        }

        .error {
            color: var(--error-color);
        }

        link-element {
            font-weight: bold;
            text-decoration: underline;
        }
    `;
}
