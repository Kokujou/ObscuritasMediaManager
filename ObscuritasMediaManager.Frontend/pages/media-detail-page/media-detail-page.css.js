import { css } from '../../exports.js';

export function renderMediaDetailPageStyles() {
    return css`
        .media-detail-container {
            display: flex;
            flex-direction: column;
            height: 100%;

            margin-left: 60px;
        }

        .media-heading {
            font-size: 36px;
            margin-bottom: 20px;
        }

        .content-panels {
            display: flex;
            flex-direction: row;
            height: 100%;
        }

        .left-panel,
        .right-panel {
            display: flex;
            flex-direction: column;
        }

        .left-panel {
            width: 30%;
        }

        .media-image {
            height: 30%;
            background-size: auto 100%;
            background-position: center;
            background-repeat: no-repeat;
        }

        .property-entry {
            display: flex;
            flex-direction: row;
            font-size: 24px;
        }
    `;
}
