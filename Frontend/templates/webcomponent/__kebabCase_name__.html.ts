import { html } from 'lit-element';
import { {{ pascalCase name }} } from './{{ kebabCase name }}';

/**
 * @param { {{ pascalCase name }} } {{ camelCase name}}
 */
export function render{{ pascalCase name }}({{ camelCase name }}) {
    return html` your html content `;
}
