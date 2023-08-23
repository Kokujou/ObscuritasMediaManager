import { css } from '../../exports.js';
import { registerIcons } from '../../resources/inline-icons/icon-registry.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { editIcon } from './images/edit-icon.svg.js';
import { trashIcon } from './images/trash-icon.svg.js';

export function renderMediaDetailPageStyles() {
    return css`
        ${registerIcons()}

        #edit-button {
            position: fixed;
            right: 0;
            top: 50px;
            width: 400px;
            z-index: 1;

            display: flex;
            flex-direction: row;

            cursor: pointer;
        }

        #edit-toggle {
            margin-right: 20px;

            --untoggled-color: white;
            --toggled-color: red;
        }

        #toggle-edit-text {
            font-size: 24px;
        }

        :host([editMode]) #toggle-edit-text {
            color: red;
        }

        #media-detail-container {
            display: flex;
            flex-direction: column;
            height: 100%;

            margin-left: 60px;
        }

        #media-heading {
            font-size: 36px;
            margin-bottom: 20px;
            position: relative;
            display: flex;
            flex-direction: row;
            width: 100%;
        }

        #content-panels {
            display: flex;
            flex-direction: row;
            height: min-content;
        }

        #left-panel,
        #right-panel,
        #middle-panel {
            display: flex;
            flex-direction: column;
            flex: auto;
        }

        #left-panel {
            width: 30%;
            min-width: 300px;
            align-items: center;
            margin-right: 50px;
        }

        #right-panel {
            margin: 0 50px;
            flex: auto;
        }

        media-tile {
            width: 100%;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #delete-icon-container {
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

        media-tile:hover #delete-icon-container {
            opacity: 1;
        }

        media-tile #delete-icon {
            width: 100px;
            height: 100px;

            margin: 10px;
            background: darkred;
            z-index: 1;
            cursor: pointer;

            ${renderMaskImage(trashIcon())};
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
            flex: auto;
        }

        .genre-entry {
            flex-direction: column;
            align-items: flex-start;
        }

        .genre-entry .property-name {
            margin-bottom: 10px;
        }

        .genre-entry .property-value {
            align-items: center;
        }

        tag-label {
            margin-right: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
        }

        .edit-icon {
            cursor: pointer;
            margin: 5px;
            width: 30px;
            height: 30px;
            background-color: gray;
            ${renderMaskImage(editIcon())};
        }

        input,
        textarea {
            outline: none;

            font: inherit;
            color: inherit;
        }

        input[disabled],
        textarea[disabled] {
            user-select: none;
            border: none;
        }

        input {
            background: none;
            border: none;
            border-bottom: 1px solid;
            padding: 5px 10px;
        }

        .textarea {
            width: 600px;
            height: 200px;
            overflow-y: auto;
            background: var(--accent-color);
            border: 3px dashed;
            border-radius: 15px;
            padding: 10px 20px;
            resize: none;
            color: white;
            font-size: 18px;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            display: inline-block;
            word-wrap: break-word;
            line-break: normal;
            caret-color: white;
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

        #media-rating {
            display: flex;
            flex-direction: row;
        }

        #media-rating .star {
            color: gray;
            text-shadow: 3px 3px 3px black;
            font-size: 48px;
            cursor: pointer;
            line-height: 1;
        }

        #media-rating .star.selected {
            color: yellow;
        }

        #media-rating .star.hovered {
            color: darkorange;
        }

        #streaming-panel {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .arrow {
            cursor: pointer;
            margin: 20px;
        }

        .arrow.inactive {
            color: gray;
            cursor: default;
        }

        #season-scroll-area {
            max-width: 50%;
            display: flex;
            flex-direction: row;
            margin: 20px;
            align-items: center;
        }

        #season-inner {
            display: flex;
            flex-direction: row;

            justify-content: flex-start;
            font-size: 30px;
            overflow-x: auto;
            overflow-y: hidden;

            -ms-overflow-style: none;
            scrollbar-width: none;
            flex-wrap: nowrap;
        }

        #season-scroll-area ::-webkit-scrollbar {
            display: none;
        }

        #season-scroll-area .link {
            white-space: nowrap;
        }

        #season-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 18px;
            padding: 20px;
            margin-bottom: 40px;
            border-radius: 20px;

            background-color: #883377bb;
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

        *[disabled] {
            pointer-events: none;
        }
    `;
}
