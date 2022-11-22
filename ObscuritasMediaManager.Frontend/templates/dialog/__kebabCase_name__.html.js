import { html } from '../../exports.js';
import { {{ pascalCase name }} } from './{{ kebabCase name }}.js';

/**
 * @param { {{ pascalCase name }} } dialog
 */
export function render{{ pascalCase name}}(dialog) {
    return html`
        <dialog-base
            caption="Your caption"
            @decline="${() => console.log('custom decline function - bubbles if not prevented')}"
            @accept="${() => console.log('custom accept action')}"
        >
            your dialog content
        </dialog-base>
    `;
}
