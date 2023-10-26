import { html } from '../../exports.js';
import { LoadingCircle } from './loading-circle.js';

/**
 * @param { LoadingCircle } loadingCircle
 */
export function renderLoadingCircle(loadingCircle) {
    return html`
        <svg>
            <g>
                <circle stroke="purple" fill="transparent" r="calc(50% - 5px)" cx="50%" cy="50%"></circle>
            </g>
        </svg>
    `;
}
