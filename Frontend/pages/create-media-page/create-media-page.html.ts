import { html } from 'lit-element';
import { CreateMediaPage } from './create-media-page';

/**
 * @param { CreateMediaPage } createMediaPage
 */
export function renderCreateMediaPage(createMediaPage: CreateMediaPage) {
    return html` <media-detail-page createNew editMode></media-detail-page> `;
}
