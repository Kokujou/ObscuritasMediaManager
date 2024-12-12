import { html } from 'lit-element';
import { {{ pascalCase name }} } from './{{ kebabCase name }}';

/**
 * @param { {{ pascalCase name }} } dialog
 */
export function render{{ pascalCase name}}(dialog) {
    return html`
        <dialog-base
            caption="Your caption"
            acceptActionText="Ok"
            declineActionText="Abbrechen"
            canAccept
            showBorder
            @decline="${() => console.log('custom decline function - bubbles if not prevented')}"
            @accept="${() => console.log('custom accept action')}"
        >
            your dialog content
        </dialog-base>
    `;
}
