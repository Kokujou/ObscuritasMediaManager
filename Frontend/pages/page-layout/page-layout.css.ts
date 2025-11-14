import { css } from 'lit';

export function renderWebcomponentTemplateStyles() {
    return css`
        :host {
            user-select: none;
            --header-height: 100px;
            --navigation-width: 350px;
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

        #layout-content {
            top: var(--header-height);
            left: var(--navigation-width);
            bottom: 0;
            right: 0;
            overflow-y: auto;
            margin: 10px;
            margin-top: 30px;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        ${renderHeaderStyles()}
        ${renderNavigationStyles()}
    `;
}

function renderHeaderStyles() {
    return css`
        #header {
            position: relative;
            height: var(--header-height);
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
            font-size: 36px;
            font-weight: bold;
        }

        #header #logo #subtitle {
            font-size: 16px;
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
            top: var(--header-height);
            bottom: 0;
            width: var(--navigation-width);
            margin-top: 100px;
        }

        #navigation {
            width: 100%;
            display: inline-block;
            background-color: var(--accent-color);
            padding: 20px 0;
            border-top-right-radius: 5%;
            border-bottom-right-radius: 5%;

            max-height: calc(100% - var(--header-height) - 40px);

            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        #link-area {
            position: relative;
            margin: 0 20px;
        }

        #nav-section {
            display: flex;
            flex-direction: row;

            border-top: 2px solid var(--font-color);
        }

        #nav-section:first-of-type {
            border-top: none;
        }

        .nav-section-links {
            display: flex;
            flex-direction: column;
            margin: 10px 0;
        }

        .nav-section-heading {
            font-size: 18px;
            padding: 20px;
            writing-mode: vertical-rl;
            text-align: center;
            text-shadow: 2px 2px 2px black;
            letter-spacing: 4px;
        }

        #home-link {
            font-size: 18px !important;
            border-bottom: none !important;
        }

        link-element {
            text-shadow: 2px 2px 2px black;
            letter-spacing: 2px;
            font-size: 18px;
            white-space: nowrap;

            margin-left: 20px;
            min-height: 40px;

            display: flex;
            align-items: center;
            justify-content: stretch;

            border-bottom: 2px solid transparent;
        }

        link-element:hover {
            border-bottom: 2px solid var(--font-color);
        }

        link-element.active {
            font-weight: bold;
        }
    `;
}
