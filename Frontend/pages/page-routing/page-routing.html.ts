import { html } from 'lit';
import { PageRouting } from './page-routing';

export function renderPageRouting(this: PageRouting) {
    return html` <div id="current-page" style="width: ${PageRouting.instance?.scrollWidth}px"><slot></slot></div> `;
}
