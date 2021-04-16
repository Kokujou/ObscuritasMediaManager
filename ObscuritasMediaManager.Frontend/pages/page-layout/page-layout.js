import { LitElement } from '../../exports.js';
import { renderWebcomponentTemplateStyles as renderPageLayoutStyles } from './page-layout.css.js';
import { renderWebcomponentTemplate as renderPageLayout } from './page-layout.html.js';

export class PageLayout extends LitElement {
    static get styles() {
        return renderPageLayoutStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
    }

    render() {
        return renderPageLayout();
    }
}
