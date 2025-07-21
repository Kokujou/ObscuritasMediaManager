import { html } from 'lit-element';
import { PageRouting } from './page-routing';

export function renderPageRouting(this: PageRouting) {
    return html`<style></style>
        <div id="viewport">
            <div id="page-container">
                <div id="current-page"><slot></slot></div>
            </div>
        </div>`;
}
