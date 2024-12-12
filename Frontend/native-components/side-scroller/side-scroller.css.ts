import { css } from 'lit-element';

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
            overflow: hidden;
            scrollbar-width: none;

            mask: linear-gradient(to right, transparent 0%, black 10% 90%, transparent 100%);
        }

        #item-container {
            transition: transform 0.5s ease-out;

            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .inner-space {
            min-width: 50%;
            height: 100%;
        }
    `;
}
