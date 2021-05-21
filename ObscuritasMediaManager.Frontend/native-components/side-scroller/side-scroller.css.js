import { css } from '../../exports.js';

export function renderSideScrollerStyles() {
    return css`
        :host {
            position: relative;
            display: inline-block;
        }

        #scroll-container {
            display: flex;
            flex-direction: row;

            position: relative;
            width: 100%;
            height: 100%;
        }

        .arrow-link {
            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;
            min-width: 30px;

            user-select: none;
            cursor: pointer;
        }

        .arrow-link.disabled {
            filter: brightness(0.6);
            cursor: default;
            pointer-events: none;
        }

        #content-container {
            flex: auto;
            overflow-y: hidden;
            overflow-x: scroll;
            scrollbar-width: none;

            display: flex;
            flex-direction: row;
            align-items: center;

            mask: linear-gradient(to right, transparent 0%, black 10% 90%, transparent 100%);
        }

        .inner-space {
            min-width: 50%;
            height: 100%;
        }
    `;
}
