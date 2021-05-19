import { css } from '../../exports.js';

const headerHeight = css`100px`;
const navigationWidth = css`350px`;

export function renderWebcomponentTemplateStyles() {
    return css`
        :host {
            user-select: none;
        }

        #layout-content {
            animation: fade-in 1s normal ease-in;

            mask-size: 100% 500%;
            mask-image: linear-gradient(to top, #0000 25%, #000 75%);

            -webkit-mask-size: 100% 500%;
            -webkit-mask-image: linear-gradient(to top, #0000 25%, #000 75%);
        }

        @keyframes fade-in {
            0% {
                mask-position: bottom;
                -webkit-mask-position: bottom;
            }

            100% {
                mask-position: top;
                -webkit-mask-position: top;
            }
        }

        #header,
        #navigation,
        #layout-content {
            position: absolute;
        }

        ${renderHeaderStyles()}
        ${renderNavigationStyles()}

#layout-content {
            top: ${headerHeight};
            left: ${navigationWidth};
            bottom: 0;
            right: 0;
            overflow-y: auto;
            margin: 10px;

            scrollbar-color: #20625599 transparent;
            scrollbar-width: thin;
        }

        a {
            text-decoration: none;
            color: inherit;
        }
    `;
}

function renderHeaderStyles() {
    return css`
        #header {
            position: relative;
            height: ${headerHeight};
            width: 100%;

            white-space: nowrap;
            overflow: visible;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        #header #logo-container {
            height: 200%;
            width: 75%;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        #header #logo {
            -webkit-background-clip: text;
            -moz-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            -moz-text-fill-color: transparent;

            cursor: pointer;
            user-select: none;
            background-size: 400%;
            background-image: linear-gradient(130deg, #553355 45%, #8888aa 50%, #553355 55%);
            animation: sparkle 3s infinite;
        }

        @keyframes sparkle {
            0% {
                background-position: 25%;
            }

            100% {
                background-position: 75%;
            }
        }

        #header #logo #title {
            font-size: 48px;
            font-weight: bold;
        }

        #header #logo #subtitle {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
        }
    `;
}

function renderNavigationStyles() {
    return css`
        br {
            display: none;
        }

        #navigation-container {
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            top: ${headerHeight};
            bottom: 0;
            width: ${navigationWidth};
        }

        #navigation {
            width: 100%;
            display: inline-block;
            background-color: var(--accent-color);
            padding: 20px 0;
            border-top-right-radius: 5%;
            border-bottom-right-radius: 5%;

            max-height: calc(100% - ${headerHeight} - 40px);

            overflow-y: auto;
            scrollbar-color: #20625599 transparent;
            scrollbar-width: thin;
        }

        #link-area {
            position: relative;
            margin: 0 20px;
        }

        #nav-section {
            display: flex;
            flex-direction: row;

            border-top: 1px solid lightseagreen;
        }

        #nav-section:first-of-type {
            border-top: none;
        }

        #nav-section-links {
            display: flex;
            flex-direction: column;
            margin: 10px 0;
        }

        #nav-section-heading {
            font-size: 30px;
            padding: 20px;
            writing-mode: vertical-rl;
            text-align: center;
            text-shadow: 2px 2px 2px black;
        }

        #home-link {
            font-size: 30px !important;
            border-bottom: none !important;
        }

        .nav-item {
            text-shadow: 2px 2px 2px black;
            font-size: 20px;
            white-space: nowrap;

            margin-left: 20px;
            padding-top: 15px;
            padding-bottom: 15px;

            border-bottom: 2px solid transparent;
        }

        .nav-item:hover {
            border-bottom: 2px solid lightseagreen;
        }
    `;
}
