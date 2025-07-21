import { css } from 'lit-element';

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
            position: relative;
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
            overflow: visible;

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

        :host([scrollingPaused]) #lyrics-content-wrapper-2 {
            animation-play-state: paused;
        }

        @keyframes scroll-to-end {
            from {
                transform: translateY(200px);
            }

            to {
                transform: translateY(calc(-100% + 200px));
            }
        }

        #audio-controls {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 40px;
        }

        #save-lyrics-button {
            color: green;
        }

        #save-lyrics-button > .icon {
            background: green;
        }

        #next-lyrics-button {
            color: red;
        }

        #next-lyrics-button > .icon {
            background: red;
        }

        .link {
            cursor: pointer;

            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }

        .link:hover {
            text-decoration: underline;
        }

        .link[disabled] {
            color: darkgray !important;
            pointer-events: none !important;
        }

        .link[disabled] .icon {
            background: darkgray !important;
        }

        .link .icon {
            width: 20px;
            height: 20px;
        }

        #scroll-controls {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            gap: 40px;
        }

        #scroll-up-button {
            rotate: 270deg;
        }

        #scroll-down-button {
            rotate: 90deg;
        }

        .icon {
            width: 40px;
            height: 40px;

            background: white;

            cursor: pointer;
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
