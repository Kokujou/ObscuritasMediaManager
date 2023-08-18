import { html } from '../../exports.js';
import {
    getScaleFactorX,
    getScaleFactorY,
    viewportHeight,
    viewportWidth,
} from '../../services/extensions/document.extensions.js';
import { PageRouting } from './page-routing.js';

/**
 * @param {PageRouting} routing
 */
export function renderPageRouting(routing) {
    var scaleX = getScaleFactorX();
    var scaleY = getScaleFactorY();
    return html`<style>
            #current-page {
                transform: scale(${scaleX}, ${scaleY});
                transform-origin: 0 0;
            }

            #viewport {
                width: ${innerWidth}px;
                height: ${innerHeight}px;
            }

            #page-container {
                overflow: hidden;
                width: ${viewportWidth * scaleX}px;
                height: ${viewportHeight * scaleY}px;
            }
        </style>
        <div id="viewport">
            <div id="page-container">
                <div id="current-page">${routing.currentPage.template ?? html`<slot></slot>`}</div>
            </div>
        </div>`;
}
