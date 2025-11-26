import { css } from 'lit';

export function renderOfflineMusicPagePortraitStyles() {
    return css`
        @media (orientation: portrait) {
            #search-results-container {
                position: fixed;
                left: 0;
                top: 50px;
                bottom: 50px;
                right: 0;
                box-sizing: border-box;
            }

            #search-panel-container {
                position: fixed;
                max-height: unset;
                left: 100%;
                width: 100%;
                top: 0;
                bottom: 0;
                transition: left 0.5s ease-in-out;
            }

            #search-panel-container[flipped] {
                left: 0;
            }

            #draw-sidebar-icon {
                display: flex;
                align-items: center;
                justify-content: center;

                position: absolute;
                top: 50%;
                left: 0;
                width: 30px;
                height: 60px;
                border-radius: 0 10px 10px 0;
                z-index: 1;
                transform: translateY(-50%);

                background: var(--accent-color);
                backdrop-filter: blur(20px);
                box-shadow: 1px 0 1px white;

                color: #fffa;
                font-weight: bold;
                font-size: 24px;

                rotate: 180deg y;
                transform-origin: 0 -100%;

                user-select: none;
                -webkit-user-select: none;
                cursor: grabbing;

                transition: rotate 0.25s ease-in-out;
                transition-delay: 0.25s;
            }

            #search-panel-container[flipped] #draw-sidebar-icon {
                rotate: 0deg y;
            }

            #result-options-container {
                position: fixed;
                z-index: 1;
                bottom: -40px;
                left: 50%;
                transform: translateY(-50%);
            }
        }
    `;
}
