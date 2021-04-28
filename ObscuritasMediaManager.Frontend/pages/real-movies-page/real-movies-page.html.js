import { html } from '../../exports.js';
import { RealMoviesPage } from './real-movies-page.js';

/**
 * @param {RealMoviesPage} realMovies
 */
export function renderRealSeriesPage(realMovies) {
    return html` <media-page mediaType="RealMovies"></media-page> `;
}
