import { css } from '../../exports.js';

export function renderVideoPlayerStyles() {
    return css`
        :host {
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
        }

        #video {
            position: fixed;
            width: 100vw;
            height: 100vh;
            background: black;
        }
    `;
}
