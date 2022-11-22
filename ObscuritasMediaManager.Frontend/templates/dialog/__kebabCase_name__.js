import { LitElement } from '../../exports.js';
import { render{{ pascalCase name }}Styles } from './{{ kebabCase name }}.css.js';
import { render{{ pascalCase name }} } from './{{ kebabCase name }}.html.js';

export class {{ pascalCase name }} extends LitElement
{
    static get styles() {
        return render{{ pascalCase name }}Styles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: false },
        };
    }

    constructor() {
        super();
        /** @type {String} */ this.someProperty = '';
    }

    /**
     * @returns { {{ pascalCase name }} }
     */
    static show() {
        var dialog = new {{ pascalCase name }}();

        document.body.append(dialog);
        dialog.requestUpdate(undefined);

        return dialog;
    }

    render() {
        return render{{ pascalCase name }}(this);
    }
}
