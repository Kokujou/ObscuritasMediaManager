import { html } from 'lit-element';
import { LoadingCircle } from './loading-circle';

/**
 * @param { LoadingCircle } loadingCircle
 */
export function renderLoadingCircle(loadingCircle) {
    return html`
        <svg width="100%" height="100%">
            <g>
                <circle stroke="purple" fill="transparent" r="calc(50% - 5px)" cx="50%" cy="50%"></circle>
            </g>
        </svg>
    `;
}
