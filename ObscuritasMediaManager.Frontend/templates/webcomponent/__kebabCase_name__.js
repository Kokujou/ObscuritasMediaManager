import { session } from '../../data/session.js';
import { render{{ pascalCase name }} } from './{{ kebabCase name }}.html.js';
import { render{{ pascalCase name }}Styles } from './{{ kebabCase name }}.css.js';
import { LitElementBase } from '../../data/lit-element-base.js';

export class {{ pascalCase name }} extends LitElementBase {
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
