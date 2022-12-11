import { LitElementBase } from '../../data/lit-element-base.js';
import { css } from '../../exports.js';
import { renderJDramaPage } from './jdrama-page.html.js';

export class JDramaPage extends LitElementBase {
    static get isPage() {
        return true;
    }
    static get styles() {
        return css``;
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        document.title = 'J-Drama';
    }

    render() {
        return renderJDramaPage(this);
    }
}
