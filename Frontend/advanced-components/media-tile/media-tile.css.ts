import { css } from 'lit';

export function renderMediaTileStyles() {
    return css`
        :host {
            display: inline-flex;
            flex-direction: column;
        }

        #tile-container {
            position: relative;
            width: 100%;
            min-height: inherit;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            user-select: none;
            -webkit-user-select: none;
        }

        #tile-image {
            position: relative;
            flex: auto;

            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;

            display: flex;
            flex-direction: row;
        }

        #no-image-icon {
            background: #fff6;
            flex: auto;
            margin: 30px;
        }

        #rating-container {
            position: absolute;
            top: 20px;
            right: 10px;
            z-index: 1;
        }

        #rating-container .star {
            color: gray;
            text-shadow: 3px 3px 3px black;
            font-size: 18px;
            cursor: pointer;
            line-height: 1;
        }

        #rating-container .star.selected {
            color: yellow;
        }

        #rating-container .star.hovered {
            color: darkorange;
        }

        #caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            padding-top: 100%;
            padding-bottom: 10px;
            background: linear-gradient(to bottom, transparent, #000c);
            pointer-events: none;

            cursor: pointer;
            font-size: 16px;
            text-shadow: 2px 2px 2px black;
            color: white;
            text-align: center;
            transition: max-height 1s ease;
        }

        #caption[no-background] {
            background: none;
        }

        #genre-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            max-height: 35px;
            overflow: hidden;
            gap: 10px;
            margin-top: 10px;
            transition: max-height 1s ease;
            font-size: 12px;
        }

        :host(:hover) #genre-list {
            max-height: 150px;
        }

        #genre-list > * {
            margin-bottom: 5px;
        }

        #add-genre-button {
            border-radius: 50%;
            width: 20px;
            height: 20px;
            background-color: #883377;
            display: flex;
            align-items: center;
            justify-content: center;
            color: lightgray;
            font-size: 16px;
            cursor: pointer;
        }

        br {
            display: none;
        }

        #dummy-image {
            position: fixed;
            opacity: 0;
            pointer-events: none;
        }
    `;
}
