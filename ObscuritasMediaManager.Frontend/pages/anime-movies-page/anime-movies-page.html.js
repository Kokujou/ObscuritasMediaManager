import { html } from '../../exports.js';
import { AnimeMoviesPage } from './anime-movies-page.js';

/**
 * @param {AnimeMoviesPage} animeMovies
 */
export function renderAnimeMoviesPage(animeMovies) {
    return html` <media-page mediaType="AnimeMovies"></media-page> `;
}
