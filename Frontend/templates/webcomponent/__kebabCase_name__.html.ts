import { html } from 'lit';
import { {{ pascalCase name }} } from './{{ kebabCase name }}';

export function render{{ pascalCase name }}(this : {{ pascalCase name }}) {
    return html` your html content `;
}
