import { css, unsafeCSS } from '../../exports.js';
import { editIcon } from './images/edit-icon.svg.js';
import { trashIcon } from './images/trash-icon.svg.js';

export function renderMediaDetailPageStyles() {
    return css`
        .media-detail-container {
            display: flex;
            flex-direction: column;
            height: 100%;

            margin-left: 60px;
        }

        .media-heading {
            font-size: 36px;
            margin-bottom: 20px;
            position: relative;
            display: flex;
            flex-direction: row;
        }

        .content-panels {
            display: flex;
            flex-direction: row;
            height: min-content;
        }

        .left-panel,
        .right-panel {
            display: flex;
            flex-direction: column;
            flex: auto;
        }

        .left-panel {
            width: 30%;
            min-width: 300px;
            align-items: center;
            margin-right: 50px;
        }

        .right-panel {
            margin: 0 100px;
        }

        anime-tile {
            width: 100%;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-icon-container {
            position: absolute;
            transition: opacity 1s ease;
            opacity: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #999999aa;
            width: 150px;
            height: 150px;
            border-radius: 20px;
        }

        anime-tile:hover .delete-icon-container {
            opacity: 1;
        }

        anime-tile .delete-icon {
            width: 100px;
            height: 100px;

            margin: 10px;
            background: darkred;
            z-index: 1;
            cursor: pointer;

            mask: url('data:image/svg+xml;base64,${unsafeCSS(btoa(trashIcon()))}');
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: center;

            -webkit-mask: url('data:image/svg+xml;base64,${unsafeCSS(btoa(trashIcon()))}');
            -webkit-mask-size: contain;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-position: center;
        }

        .property-group {
            display: flex;
            flex-direction: column;
        }

        .property-entry {
            position: relative;
            display: flex;
            flex-direction: row;
            font-size: 24px;
            align-items: center;
            margin-bottom: 10px;
        }

        .property-value {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }

        .genre-entry {
            flex-direction: column;
            align-items: flex-start;
        }

        .genre-entry .property-name {
            margin-bottom: 10px;
        }

        tag-label {
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .edit-icon {
            cursor: pointer;
            margin: 5px;
            width: 30px;
            height: 30px;
            background-color: gray;
            mask-size: cover;
            mask: url('data:image/svg+xml;base64, ${unsafeCSS(btoa(editIcon()))}');
            mask-position: center center;
            mask-repeat: no-repeat;
            -webkit-mask-size: cover;
            -webkit-mask: url('data:image/svg+xml;base64, ${unsafeCSS(btoa(editIcon()))}');
            -webkit-mask-position: center center;
            -webkit-mask-repeat: no-repeat;
        }

        input,
        textarea {
            outline: none;

            font: inherit;
            color: inherit;
        }

        input {
            background: none;
            border: none;
        }

        .textarea {
            min-height: 100px;
            background: var(--accent-color);
            border: 3px dashed;
            border-radius: 15px;
            padding: 5px 20px;
            resize: none;
            color: white;
            font-size: 20px;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            display: inline-block;
        }

        .add-genre-button {
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

        .media-rating {
            display: flex;
            flex-direction: row;
        }

        .media-rating .star {
            color: gray;
            text-shadow: 3px 3px 3px black;
            font-size: 48px;
            cursor: pointer;
            line-height: 1;
        }

        .media-rating .star.selected {
            color: yellow;
        }

        .media-rating .star.hovered {
            color: darkorange;
        }

        .season-scroll-area {
            max-width: 100%;
            margin: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            font-size: 30px;
        }

        .season-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 18px;
            margin-bottom: 40px;
        }

        .link {
            text-shadow: 1px 1px 1px black;
            margin: 10px 30px;
            cursor: pointer;
        }

        .link:hover,
        .link.active {
            text-decoration: underline;
            text-underline-offset: 10px;
        }
    `;
}