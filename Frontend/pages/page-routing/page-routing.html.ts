import { html } from 'lit';
import { PageRouting } from './page-routing';

export function renderPageRouting(this: PageRouting) {
    return html` <div id="current-page"><slot></slot></div> `;
}
