import { html } from '../../exports.js';
import { JDramaPage } from './jdrama-page.js';

/**
 * @param {JDramaPage} jdrama
 */
export function renderJDramaPage(jdrama) {
    return html` <media-page mediaType="JDrama"></media-page> `;
}
