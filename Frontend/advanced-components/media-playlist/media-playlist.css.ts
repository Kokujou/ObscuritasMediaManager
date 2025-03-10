import { css } from 'lit-element';

export function renderMediaPlaylistStyles() {
    return css`
        :host {
            position: relative;
            width: 100%;
            height: 100%;
        }

        #playlist-container {
            display: flex;
            flex-direction: row;

            border-radius: 20px;
            box-sizing: border-box;
            border: 20px solid var(--primary-color);

            position: absolute;
            inset: 0;
        }

        #playlist-container #playlist-options {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            padding-left: 10px;
            padding-right: 30px;
            background: var(--primary-color);
        }

        .playlist-button {
            background: var(--font-color);
            width: 50px;
            height: 50px;
            cursor: pointer;
        }

        #playlist-item-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            flex: auto;

            overflow-y: auto;
            overflow-x: hidden;

            font-weight: bold;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        .playlist-entry {
            padding: 5px 20px;
            font-size: 18px;
            cursor: pointer;
            background: linear-gradient(#00000077 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        .playlist-entry:hover {
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        .playlist-entry[active] {
            background: linear-gradient(#00000033 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        #remove-track-button {
            mask: linear-gradient(transparent, transparent);
        }
    `;
}
