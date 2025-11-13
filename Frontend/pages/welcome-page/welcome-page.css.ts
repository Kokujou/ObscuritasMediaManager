import { css } from 'lit-element';

export function renderWelcomePageStyles() {
    return css`
        #welcome-page {
            margin: 40px;
        }

        #page-heading {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 40px;
            text-align: center;
        }

        #greeting {
            margin: 20px;
        }

        #tile-link-area {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        #tile-link-section {
            display: flex;
            flex-wrap: wrap;
        }

        #tile-link-section > * {
            margin: 20px;
        }

        image-tile {
            display: block;
            border-radius: 50%;

            width: 200px;
            height: 200px;
        }
    `;
}
