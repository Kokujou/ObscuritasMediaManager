import { html } from '../../exports.js';
import { GenreDialog } from './genre-dialog.js';

/**
 * @param {GenreDialog} genreDialog
 */
export function renderGenreDialog(genreDialog) {
    return html`
        <dialog-base
            caption="Tags auswählen"
            @decline="${() => genreDialog.dispatchEvent(new CustomEvent('decline'))}"
            @accept="${() => genreDialog.accept()}"
        >
            <div class="genre-container">
                ${Object.keys(genreDialog.genreDict).map((section) =>
                    renderGenreSection(section, genreDialog.genreDict[section], genreDialog)
                )}
            </div>
        </dialog-base>
    `;
}

/**
 * @param {string} section
 * @param {string[]} genres
 * @param {GenreDialog} genreDialog
 */
function renderGenreSection(section, genres, genreDialog) {
    return html`<div class="genre-section">
        <div class="section-title">${section}</div>
        <div class="genre-list">${genres.map((genre) => renderGenre(genre, genreDialog))}</div>
    </div>`;
}

/**
 * @param {string} genre
 * @param {GenreDialog} genreDialog
 */
function renderGenre(genre, genreDialog) {
    return html`<tri-value-checkbox @valueChanged="${(e) => genreDialog.handleGenreSelection(e.detail, genre)}" class="genre-checkbox"
        >${genre}</tri-value-checkbox
    >`;
}
