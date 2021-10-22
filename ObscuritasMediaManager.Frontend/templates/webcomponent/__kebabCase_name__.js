import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { render{{ pascalCase name }} } from './{{ kebabCase name }}.html.js';
import { render{{ pascalCase name }}Styles } from './{{ kebabCase name }}.css.js';

export class {{ pascalCase name }} extends LitElement {
    static get styles() {
        return render{{ pascalCase name }}Styles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {string} */ this.someProperty;
    }

    render() {
        return render{{ pascalCase name }}(this);
    }
}
