import { css } from '../../exports.js';

export function renderScrollSelectStyles() {
    return css`
        #scroll-container {
            padding: 20px;
        }

        #scorll-items {
            display: flex;
            flex-direction: column;
            max-height: 100%;
        }

        #scroll-items ::after,
        #scroll-item ::before {
            content: ' ';
            min-height: 50%;
        }

        .scroll-item {
            width: 100%;
            padding: 10px;
            opacity: 0.5;
        }
    `;
}
