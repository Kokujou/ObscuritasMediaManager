import { css } from 'lit';

export function renderOfflineMusicDetailsPageStyles() {
    return css`
        :host {
            width: 100%;
            height: 100%;

            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            user-select: none;
            -webkit-user-select: none;
        }

        * {
            width: unset;
        }

        #back-button {
            font-size: 40px;
            font-weight: bold;
            align-self: flex-start;
        }

        #player {
            padding: 0 40px;
            margin: 20px;
            border-radius: 20px;

            background: linear-gradient(#00000033 0% 100%), linear-gradient(var(--secondary-color) 0% 100%);
            box-shadow: 0 0 50px var(--secondary-color);

            gap: 20px;

            align-items: center;
        }

        audio-tile-base {
            display: inline-block;
            min-width: 300px;
            height: 300px;
        }

        #caption {
            align-items: center;
        }

        #title {
            font-size: 18px;
        }

        #sources {
        }

        #controls {
            gap: 30px;
            justify-content: center;
            align-items: center;
        }

        .control-section {
            gap: 10px;
        }

        .audio-control {
            width: 30px;
            height: 30px;

            background: white;

            cursor: pointer;
        }

        #last-track {
            rotate: 180deg y;
        }

        #volume {
            width: 100px;
        }

        #time {
            gap: 10px;
            width: 100%;
        }

        #track-position {
            flex: auto;
            width: 100%;
        }

        range-slider {
            --background-color: #00000033;
            --slider-color: var(--secondary-color);
        }

        #next-track-row {
            align-items: center;
            justify-content: center;
            width: 100%;
            gap: 10px;
            padding: 20px 0;
            white-space: nowrap;
        }

        #next-track-text {
            flex: auto;
            height: 100%;
        }

        #next-track-name-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            margin-left: 10px;
            flex: auto;
            height: 100%;
        }

        #next-track-name {
            position: absolute;
            left: 0;
            display: inline-block;
            animation: slide-text 6s linear infinite;
            transform: translate(0);
            white-space: nowrap;
        }

        @keyframes slide-text {
            10% {
                transform: translateX(0%);
            }

            50% {
                transform: translateX(-120%);
            }

            50.001% {
                transform: translateX(100%);
            }

            90% {
                transform: translateX(0%);
            }
        }
    `;
}
