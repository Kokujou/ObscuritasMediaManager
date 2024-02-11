import { html } from '../../exports.js';
import { LoadingScreen } from '../loading-screen/loading-screen.js';

export function renderPartialLoading() {
    return html`
        <style>
            @import './native-components/loading-screen/loading-icon.css';

            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            #wrapper {
                width: 30%;
                height: 30%;
            }

            :host([hideText]) #loading-text {
                display: none;
            }
        </style>

        <div id="wrapper">${html([LoadingScreen.renderLoadingIcon()])}</div>
    `;
}
