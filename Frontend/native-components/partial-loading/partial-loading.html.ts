import { html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
//@ts-ignore
import { loadingIcon } from '../../resources/inline-icons/general/loading.icon.svg.js';

export function renderPartialLoading() {
    return html`
        <link rel="stylesheet" href="./native-components/loading-screen/loading-icon.css" />
        <style>
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }

            :host(:not([full-width])) #wrapper {
                width: 30%;
                height: 30%;
            }

            :host([hideText]) #loading-text {
                display: none;
            }
        </style>

        <div id="wrapper">${unsafeHTML(loadingIcon())}</div>
    `;
}
