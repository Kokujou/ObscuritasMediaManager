import { css } from 'lit';

export function renderAudioTileStyles() {
    return css`
        :host {
            display: inline-flex;
            flex-direction: column;
            position: relative;
        }

        #tile-container {
            position: relative;
            min-height: inherit;
            width: var(--audio-tile-width);

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--secondary-color) 0 100%);
            box-shadow: 0 0 50px var(--secondary-color);

            border-radius: 20px;
            box-sizing: border-box;

            padding: 10px;

            user-select: none;
            cursor: pointer;
            color: var(--font-color);
        }

        audio-tile-base {
            min-height: var(--audio-tile-min-height);
            margin-bottom: 10px;
        }

        #tile-description {
            flex: auto;
            display: flex;
            flex-direction: column;
        }

        .inline-icon.unset {
            display: none;
        }

        #audio-title {
            font-size: 16px;
            text-align: center;

            overflow: hidden;
        }

        #audio-genre-section {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            max-height: 35px;

            margin-top: 10px;
            overflow: hidden;

            mask: linear-gradient(to bottom, black 0% 50%, transparent 100%);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            transition: all 1s ease-out;

            font-size: 12px;
        }

        :host(:hover) #audio-genre-section {
            max-height: 150px;
            mask-size: 100% 300%;
        }

        #audio-genre-section * {
            margin-left: 5px;
            margin-bottom: 5px;
            z-index: 1;
            --label-color: var(--primary-color);
        }
    `;
}
