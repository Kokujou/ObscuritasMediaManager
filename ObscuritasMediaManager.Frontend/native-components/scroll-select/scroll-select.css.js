import { css } from '../../exports.js';

export function renderScrollSelectStyles() {
    return css`
        #scroll-container {
            --active-item-start: calc(50% - 22px);
            --active-item-end: calc(50% + 22px);
            mask: linear-gradient(
                transparent,
                #00000055 20% var(--active-item-start),
                black var(--active-item-start) var(--active-item-end),
                #00000055 var(--active-item-end) 80%,
                transparent
            );
            max-height: 100%;
        }

        #scroll-items {
            z-index: 1;
            overflow: hidden;
            scrollbar-width: none;

            height: 100%;
        }

        #item-container:not(.user-interaction) {
            display: flex;
            flex-direction: column;

            transition: transform 0.5s ease-out;
        }

        .inner-space {
            content: ' ';
            min-height: 50%;
            display: block;
            opacity: 0;
        }

        .scroll-item {
            width: 100%;

            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;

            display: flex;
            align-items: center;
            justify-content: center;

            min-height: 40px !important;
        }

        #border-overlay {
            position: absolute;
            left: 0;
            right: 0;
            top: var(--active-item-start);
            height: 40px;

            border-bottom: 1px solid;
            border-top: 1px solid;
        }
    `;
}
