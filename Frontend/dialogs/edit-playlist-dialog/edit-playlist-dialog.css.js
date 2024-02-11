import { css } from '../../exports.js';

export function renderEditPlaylistDialogStyles() {
    return css`
        #container {
            display: flex;
            flex-direction: column;
            gap: 50px;
            width: 900px;
            font-size: 22px;
            max-height: 600px;
            overflow-y: auto;
            padding-right: 20px;
        }

        #meta-configuration {
            display: flex;
            flex-direction: row;
            gap: 50px;
        }

        #image-data-section {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        upload-area {
            width: 200px;
            height: 200px;
            max-width: 200px;
            max-height: 200px;
        }

        #text-data-section {
            display: flex;
            flex-direction: column;
            flex: auto;
            gap: 20px;
        }

        #playlist-genres tag-label {
            font-size: 16px;
        }

        #playlist-genres .property-value {
            display: inline-flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .property {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .property-label {
            width: 120px;
            font-weight: bold;
        }

        input.property-value {
            outline: none;
            border: none;
            color: inherit;
            font-size: inherit;
            border-bottom: 1px solid var(--font-color);
            padding: 10px;
            width: 350px;
            background: none;
        }

        drop-down {
            --accent-color-full: #333;
            width: 250px;
        }

        #playlist-region {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        #tracks-section {
            position: relative;
            min-height: 200px;
            height: 200px;
            padding: 10px;

            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        #drag-info-overlay {
            position: absolute;
            inset: 0;
            background: black;
            z-index: 1;
        }

        #tracks-actions {
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
        }

        .track-action {
            width: 60px;
            height: 60px;
            background: white;
            cursor: pointer;
        }

        #tracks-container {
            flex: auto;
            position: relative;
            border: 2px solid;
            border-radius: 10px;
        }
    `;
}
