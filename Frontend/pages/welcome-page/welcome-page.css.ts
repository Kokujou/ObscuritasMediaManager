import { css } from 'lit-element';

export function renderWelcomePageStyles() {
    return css`
        #welcome-page {
            margin: 40px;
        }

        #page-heading {
            font-size: 40px;
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

            width: 250px;
            height: 250px;
        }
    `;
}
