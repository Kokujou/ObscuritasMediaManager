import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

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

        <div id="wrapper">${unsafeHTML('')}</div>
    `;
}
