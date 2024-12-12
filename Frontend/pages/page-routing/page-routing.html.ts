import { html } from 'lit-element';
import { getScaleFactorX, getScaleFactorY, viewportHeight, viewportWidth } from '../../services/extensions/document.extensions';
import { PageRouting } from './page-routing';

/**
 * @param {PageRouting} routing
 */
export function renderPageRouting(routing: PageRouting) {
    var scaleX = getScaleFactorX();
    var scaleY = getScaleFactorY();
    return html`<style>
            #viewport {
                width: ${innerWidth}px;
                height: ${innerHeight}px;
            }

            #page-container {
                overflow: hidden;
                width: ${viewportWidth * scaleX}px;
                height: ${viewportHeight * scaleY}px;
            }

            #current-page {
                transform: scale(${scaleX}, ${scaleY});
                transform-origin: 0 0;
            }
        </style>
        <div id="viewport">
            <div id="page-container">
                <div id="current-page"><slot></slot></div>
            </div>
        </div>`;
}
