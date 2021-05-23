import { css } from '../../exports.js';
import { viewportHeight, viewportWidth } from '../../services/extensions/document.extensions.js';

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
            left: 0;
            top: 0;
            width: ${viewportWidth}px;
            height: ${viewportHeight}px;
            background: black;
        }
    `;
}
