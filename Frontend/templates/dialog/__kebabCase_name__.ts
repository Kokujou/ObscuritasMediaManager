import { LitElement } from 'lit-element';
import { render{{ pascalCase name }}Styles } from './{{ kebabCase name }}.css';
import { render{{ pascalCase name }} } from './{{ kebabCase name }}.html';

@customElement('{{ kebabCase name }}')
export class {{ pascalCase name }} extends LitElementBase
{
    static override get styles() {
        return render{{ pascalCase name }}Styles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: false },
        };
    }

    static show() {
        var dialog = new {{ pascalCase name }}();

        document.body.append(dialog);
        dialog.requestFullUpdate();

        return dialog;
    }

    @property() someProperty = '';

    override render() {
        return render{{ pascalCase name }}(this);
    }
}
