import { html } from 'lit-element';
import { PageRouting } from './page-routing';

export function renderPageRouting(this: PageRouting) {
    return html` <div id="current-page"><slot></slot></div> `;
}
