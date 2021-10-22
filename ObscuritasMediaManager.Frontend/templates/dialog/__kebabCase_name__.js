import { LitElement } from '../../exports.js';
import { {{ pascalCase name }}Result } from '../dialog-result/genre-dialog.result.js';
import { render{{ pascalCase name }}Styles } from './genre-dialog.css.js';
import { render{{ pascalCase name }} } from './genre-dialog.html.js';

export class {{ pascalCase name }} ./__kebabCase_name__.html.js
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
     * @returns {{{ pascalCase name }}}
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
