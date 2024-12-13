import { session } from '../../data/session';
import { render{{ pascalCase name }} } from './{{ kebabCase name }}.html';
import { render{{ pascalCase name }}Styles } from './{{ kebabCase name }}.css';
import { LitElementBase } from '../../data/lit-element-base';

@customElement('{{ kebabCase name }}')
export class {{ pascalCase name }} extends LitElementBase {
    static override get styles() {
        return render{{ pascalCase name }}Styles();
    }

    @property() public declare someProperty: string;

    override render() {
        return render{{ pascalCase name }}(this);
    }
}
