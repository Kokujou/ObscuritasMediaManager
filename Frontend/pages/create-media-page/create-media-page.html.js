import { html } from '../../exports.js';
import { CreateMediaPage } from './create-media-page.js';

/**
 * @param { CreateMediaPage } createMediaPage
 */
export function renderCreateMediaPage(createMediaPage) {
    return html` <media-detail-page 
    createNew 
    editMode></media-detail-page> `;
}
