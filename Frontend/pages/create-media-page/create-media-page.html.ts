import { html } from 'lit-element';
import { CreateMediaPage } from './create-media-page';

export function renderCreateMediaPage(this: CreateMediaPage) {
    return html` <media-detail-page createNew editMode></media-detail-page> `;
}
