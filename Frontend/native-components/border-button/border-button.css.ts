import { css } from 'lit';

export function renderBorderButtonStyles() {
    return css`
        :host {
            position: relative;
            display: block;

            --primary-color: darkgray;
            --border: 2px solid var(--primary-color);
            color: black;

            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
        }

        :host([disabled]) .border {
            opacity: 0;
        }

        :host([disabled]) {
            pointer-events: none;
            color: gray;
        }

        #button-container {
            position: relative;
            display: inline-block;
            padding: 5px;
        }

        .border {
            position: absolute;
            transition: all 0.25s ease;
        }

        #button-container:hover .top,
        #button-container:hover .bottom {
            height: 40%;
        }

        #button-container:hover .left,
        #button-container:hover .right {
            width: 40%;
        }

        #button-container:active .top,
        #button-container:active .bottom {
            height: 50%;
        }

        #button-container:active .left,
        #button-container:active .right {
            width: 50%;
        }

        .top,
        .bottom {
            height: 25%;
        }

        .left,
        .right {
            width: 25%;
        }

        .top {
            top: 0;
            border-top: var(--border);
        }

        .left {
            left: 0;
            border-left: var(--border);
        }

        .right {
            right: 0;
            border-right: var(--border);
        }

        .bottom {
            bottom: 0;
            border-bottom: var(--border);
        }

        #button {
            font-size: inherit;
            padding: 15px 20px;
            background-color: var(--primary-color);
            border: none;
        }

        #button-container:active:after {
            content: ' ';
            position: absolute;
            left: 5px;
            top: 5px;
            right: 5px;
            bottom: 5px;
            background-color: #00000033;
        }
    `;
}
