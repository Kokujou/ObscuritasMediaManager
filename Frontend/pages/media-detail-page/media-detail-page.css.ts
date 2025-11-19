import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { trashIcon } from './images/trash-icon.svg';

export function renderMediaDetailPageStyles() {
    return css`
        .separator {
            border-bottom: 3px solid gray;
            border-radius: 50px;
            margin: 20px 10px;
        }

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

        #popup-icon {
            width: 30px;
            height: 30px;

            background: white;

            cursor: pointer;
        }

        #edit-toggle {
            margin-right: 20px;

            --untoggled-color: red;
            --toggled-color: green;
        }

        #toggle-edit-text {
            font-size: 16px;
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

        #prev-link,
        #next-link {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            z-index: 1;
            cursor: pointer;
        }

        #prev-link {
            float: left;
        }

        #next-link {
            float: right;
        }

        link-element {
            text-decoration: underline;
        }

        #media-heading {
            font-size: 24px;

            position: relative;
            padding: 10px 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        #trailer-link {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 20px;
        }

        #media-name {
            text-overflow: ellipsis;
        }

        #content-panels {
            display: flex;
            flex-direction: row;
            height: min-content;
            gap: 30px;
        }

        #left-panel,
        #right-panel,
        #middle-panel {
            display: flex;
            flex-direction: column;
        }

        #left-panel {
            min-width: 250px;
            align-items: center;
        }

        #content-warning-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
        }

        #release-input {
            max-width: 100px;
        }

        #content-warnings {
            max-height: 500px;
            display: grid;
            grid-template-columns: auto auto;
            min-width: 250px;
        }

        .content-warning-icon-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;

            background: var(--accent-color-full);
            margin: 10px;
            padding: 10px;
            width: 90px;
            height: 90px;
            border-radius: 15px;
            cursor: pointer;
            opacity: 0.6;
        }

        #middle-panel:not([disabled]) .content-warning-icon-wrapper {
            box-shadow: 0 0 10px white;
        }

        .content-warning-icon-wrapper:hover,
        .content-warning-icon-wrapper[selected] {
            opacity: 1;
        }

        .content-warning-icon {
            width: 50px;
            height: 50px;
            background: #c22;
        }

        .content-warning-label {
            font-weight: bold;
            letter-spacing: -2px;
        }

        #right-panel,
        #description-section {
            position: relative;
            background: var(--accent-color);
            border-radius: 20px;
            padding: 20px 40px;
            flex: auto;
            margin-right: 20px;
            box-sizing: border-box;
        }

        #right-panel-top {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }

        #right-panel-left-side {
            flex: auto;
        }

        #media-image-container {
            width: 100%;
            min-height: 350px;
            display: flex;
            align-items: stretch;
            justify-content: stretch;
        }

        #media-image {
            position: relative;
            width: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
        }

        #media-image:hover:before {
            content: '';
            position: absolute;
            width: 200px;
            height: 200px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: #fff6;
        }

        #media-image:hover:after {
            content: '';
            position: absolute;
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            background-color: darkred;
            ${renderMaskImage(trashIcon())};
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
        }

        .property-group {
            display: flex;
            flex-direction: column;
        }

        .property-entry {
            position: relative;
            display: flex;
            flex-direction: row;
            font-size: 16px;
            align-items: center;
            margin-bottom: 10px;
            gap: 20px;
        }

        .sub-entry {
            font-size: 18px;
            margin-bottom: 0px !important;
        }

        .property-name {
            font-weight: bold;
            text-decoration: underline;
            width: 130px;
        }

        .property-value {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            flex: auto;
            text-overflow: ellipsis;
        }

        .genre-entry {
            flex-direction: row;
            align-items: flex-start;
            gap: 20px;
        }

        .genre-entry .property-value {
            align-items: center;
        }

        tag-label {
            margin-right: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
            font-size: 14px;
        }

        input,
        textarea {
            outline: none;
            pointer-events: all !important;

            font: inherit;
            color: inherit;
        }

        input[disabled] {
            user-select: none;
            border: none;
        }

        input {
            background: none;
            border: none;
            border-bottom: 2px solid;
            padding: 5px 10px;
        }

        .textarea {
            width: 100%;
            height: 200px;
            overflow-y: auto;
            background: var(--accent-color-full);
            border: 3px dashed;
            border-radius: 15px;
            padding: 10px 20px;
            resize: none;
            color: white;
            font-size: 16px;
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

        #target-group-section {
            flex-direction: column;
            gap: 20px;
            margin-right: 30px;
        }

        #target-group-icon {
            width: 70px;
            height: 70px;
            background: white;
            cursor: pointer;
        }

        #target-group-label {
            text-transform: uppercase;
            font-weight: bold;
            width: 70%;
        }

        #media-rating {
            display: flex;
            flex-direction: row;
        }

        #media-rating .star {
            color: gray;
            text-shadow: 3px 3px 3px black;
            font-size: 16px;
            cursor: pointer;
            line-height: 1;
        }

        #media-rating .star.selected {
            color: yellow;
        }

        #media-rating .star.hovered {
            color: darkorange;
        }

        .link {
            text-shadow: 2px 2px 2px black;
            margin: 10px 30px;
            cursor: pointer;
        }

        .link:hover,
        .link.active {
            text-decoration: underline;
            text-underline-offset: 10px;
        }

        #action-row {
            font-size: 18px;
            text-shadow: 0 0 10px purple;
            margin: 20px 0;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        #create-entry-link {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;

            cursor: pointer;
        }

        #create-entry-icon {
            width: 30px;
            height: 30px;
            background: white;
        }

        #path-row {
            margin-bottom: 20px;
            padding: 10px 40px;
            align-self: center;
            border-radius: 15px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 20px;

            background: var(--accent-color);

            font-size: 16px;
        }

        #path {
            flex: auto;
            font: inherit;
            font-size: inherit;
            width: 500px;
        }

        #edit-path-button {
            width: 40px;
            height: 40px;
            background: white;

            cursor: pointer;
        }

        *[disabled] {
            pointer-events: none;
        }
        *[icon][disabled] {
            background: darkgray !important;
        }

        #dummy-image {
            position: fixed;
            opacity: 0;
            pointer-events: none;
        }

        #related-tracks-section {
            gap: 5px;
        }

        .track-name {
            font-size: 14px;
            flex: auto;
        }
    `;
}
