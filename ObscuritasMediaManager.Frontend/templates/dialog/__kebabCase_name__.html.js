import { html } from '../../exports.js';
import { GenreDialog } from './genre-dialog.js';

/**
 * @param {GenreDialog} {{ camelCase name }}
 */
export function renderGenreDialog({{ camelCase name }}) {
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
