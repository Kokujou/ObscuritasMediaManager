import { css } from 'lit';

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

        #description {
            max-width: 400px;
        }

        #import-states {
            gap: 10px;
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

        #submit-button {
            align-self: center;
        }
    `;
}
