import { LitElementBase } from '../../data/lit-element-base.js';
import { renderWebcomponentTemplateStyles as renderPageLayoutStyles } from './page-layout.css.js';
import { renderPageLayout } from './page-layout.html.js';

export class PageLayout extends LitElementBase {
    static get styles() {
        return renderPageLayoutStyles();
    }

    render() {
        return renderPageLayout();
    }
}
