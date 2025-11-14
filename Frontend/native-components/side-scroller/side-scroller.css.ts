import { css } from 'lit';

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

            mask: linear-gradient(to right, transparent 0%, black 10% 90%, transparent 100%);
            padding: var(--side-scroller-padding-inner);
        }

        #item-container {
            position: relative;
            max-height: 100%;
            height: 100%;
            box-sizing: border-box;
            transition: transform 0.5s ease-out;

            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--side-scroller-gap, 0);
        }

        .inner-space {
            min-width: 50%;
            height: 100%;
        }
    `;
}
