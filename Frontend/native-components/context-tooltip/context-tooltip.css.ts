import { css } from 'lit';

export function renderContextTooltipStyles() {
    return css`
        :host {
            position: fixed;
            padding: 5px 7px;
            border-radius: 5px;

            z-index: 5000;
            white-space: pre;
            /* white-space: nowrap; */
            font: inherit;
            color: white;

            background: var(--accent-color-full);
            filter: drop-shadow(0 0 5px purple);

            display: flex;
            flex-direction: column;
            justify-content: center;

            transform: translate(-50%, -100%);
        }

        :host:after {
            content: '';
            position: absolute;
            top: 100%;
            left: 0;
            height: 60px;
            width: 100%;
            z-index: 5001;
        }

        :host:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 0;
            border: 20px solid transparent;
            border-top-color: var(--accent-color-full);
            border-bottom: 0;
            border-left: 0;
            margin-left: -10px;
            margin-bottom: -20px;
        }

        .item {
            padding: 5px 10px;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
        }

        .item:hover {
            text-decoration: underline;
        }
    `;
}
