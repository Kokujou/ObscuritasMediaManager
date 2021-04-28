import { html } from '../../exports.js';
import { AnimeGerSubPage } from './anime-ger-sub-page.js';

/**
 * @param {AnimeGerSubPage} animeGerSub
 */
export function renderAnimeGerSubTemplate(animeGerSub) {
    return html` <media-page mediaType="AnimesGerSub"></media-page> `;
}
