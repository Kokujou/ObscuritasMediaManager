import { css, LitElement } from '../../exports.js';
import { renderJDramaPage } from './jdrama-page.html.js';

export class JDramaPage extends LitElement {
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
