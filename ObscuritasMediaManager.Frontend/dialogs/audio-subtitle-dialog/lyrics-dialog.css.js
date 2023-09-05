import { css } from '../../exports.js';

export function renderAudioSubtitleDialogStyles() {
    return css`
        :host {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            font-weight: bold;
            color: white;

            opacity: 1;
            background: #0008;
            animation: dim-lights 0.5s linear;
        }

        #lyrics-wrapper {
            font-size: 21px;
            letter-spacing: 1.2;
            text-shadow: 0 0 3px black;

            background: black;
            padding: 0 50px;

            border-radius: 20px;

            --fade-padding: 80px;
            box-shadow: 0 0 var(--fade-padding) black, 0 0 var(--fade-padding) black, 0 0 var(--fade-padding) black,
                0 0 var(--fade-padding) black, 0 0 var(--fade-padding) black, 0 0 var(--fade-padding) black,
                0 0 var(--fade-padding) black, 0 0 var(--fade-padding) black, 0 0 var(--fade-padding) black;
        }

        #lyrics-content-wrapper {
            display: flex;
            flex-direction: column;
            max-height: 400px;
            padding: 0 50px;
            overflow-y: auto;
            scrollbar-width: thin;

            mask: linear-gradient(
                to bottom,
                transparent,
                black var(--fade-padding) calc(100% - var(--fade-padding)),
                transparent
            );
        }

        #lyrics-content-wrapper-2 {
            animation-name: scroll-to-end;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }

        @keyframes scroll-to-end {
            from {
                transform: translateY(200px);
            }

            to {
                transform: translateY(calc(-100% + 200px));
            }
        }

        .scroll-space {
            min-height: 150px;
        }

        .line {
            min-height: 31px;
            white-space: nowrap;
        }

        :host([removed]) {
            transition: opacity 0.5s linear;
            opacity: 0 !important;
            pointer-events: none;
        }

        @keyframes dim-lights {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }
    `;
}
