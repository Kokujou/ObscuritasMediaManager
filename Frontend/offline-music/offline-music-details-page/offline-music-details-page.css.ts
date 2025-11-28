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

        #player {
            position: relative;
            overflow: hidden;
            padding-bottom: 70px;
        }

        #playlist {
            position: absolute;
            top: 100%;
            width: 100%;
            height: 100%;
            padding-left: 20px;
            padding-right: 10px;
            box-sizing: border-box;

            background: #0006;
            backdrop-filter: blur(10px);

            transition: top 0.5s ease-in-out;
        }

        #playlist[expanded] {
            top: 0;
        }

        #next-track-row {
            align-items: center;
            justify-content: center;
            width: 100%;
            min-height: 70px;
            padding-right: 40px;
            gap: 10px;
            box-sizing: border-box;
            white-space: nowrap;

            translate: 0 -100%;
            transition: translate 0.5s ease-in-out;

            cursor: pointer;
        }

        #playlist[expanded] #next-track-row {
            translate: 0;
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

        #playlist-items {
            overflow: hidden;
            overflow-y: auto;
            width: 100%;
            padding-right: 20px;
            box-sizing: border-box;
        }

        .playlist-entry {
            width: 100%;
            padding: 10px 0;
            box-sizing: border-box;
            white-space: nowrap;
            gap: 20px;

            cursor: pointer;
        }

        .playlist-entry[active],
        .playlist-entry:hover {
            color: orange;
        }

        .track-icon {
            min-width: 25px;
            min-height: 25px;

            background: white;
        }

        .playlist-entry[active] .track-icon,
        .playlist-entry:hover .track-icon {
            background: orange;
        }

        .playlist-entry-name {
            font-size: 18px;
            letter-spacing: 1px;
            font-weight: bold;
        }

        .playlist-entry-source {
            font-size: 14px;
            color: #aaa;
            letter-spacing: 1px;
        }

        .playlist-entry[active] .playlist-entry-source,
        .playlist-entry:hover .playlist-entry-source {
            color: #a70;
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
