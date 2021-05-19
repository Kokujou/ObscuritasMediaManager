import { html } from '../../exports.js';
import { getScaleFactorX, getScaleFactorY } from '../../services/extensions/document.extensions.js';

export function renderPageRouting(routing) {
    var scaleX = getScaleFactorX();
    var scaleY = getScaleFactorY();

    console.log(outerWidth);

    return html`<style>
            #current-page {
                transform: scale(${scaleX}, ${scaleY});
                transform-origin: 0 0;
            }
        </style>

        <div id="viewport">
            <div id="current-page">${routing.content ? html([routing.content]) : html`<slot></slot>`}</div>
        </div>`;
}
