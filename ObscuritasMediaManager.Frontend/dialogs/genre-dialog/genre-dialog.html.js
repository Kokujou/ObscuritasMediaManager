import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { html } from '../../exports.js';
import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreDialog } from './genre-dialog.js';

/**
 * @param {GenreDialog} genreDialog
 */
export function renderGenreDialog(genreDialog) {
    return html`
        <dialog-base
            showBorder
            canAccept
            caption="Tags auswählen"
            acceptActionText="Speichern"
            declineActionText="Abbrechen"
            @decline="${() => genreDialog.dispatchEvent(new CustomEvent('decline'))}"
            @accept="${() => genreDialog.accept()}"
        >
            ${genreDialog.options.allowRemove
                ? html` <div id="remove-toggle">
                      <custom-toggle
                          @toggle="${(e) => genreDialog.toggleAttribute('editModeEnabled', e.detail == CheckboxState.Ignore)}"
                      ></custom-toggle>
                      <div id="toggle-text">Löschen</div>
                  </div>`
                : ''}

            <div id="genre-container">
                ${Object.keys(genreDialog.genreDict).map((section) =>
                    renderGenreSection(section, genreDialog.genreDict[section], genreDialog)
                )}
            </div>
        </dialog-base>
    `;
}

/**
 * @param {string} section
 * @param {GenreModel[]} genres
 * @param {GenreDialog} genreDialog
 */
function renderGenreSection(section, genres, genreDialog) {
    return html`<div class="genre-section">
        <div class="section-title">${section}</div>
        <div class="genre-list">
            ${genres.map((genre) => renderGenre(genre, genreDialog))}
            ${genreDialog.options.allowAdd
                ? html`<div id="add-genre-button" @click="${() => genreDialog.addGenre(section)}">+</div>`
                : ''}
        </div>
    </div>`;
}

/**
 * @param {GenreModel} genre
 * @param {GenreDialog} genreDialog
 */
function renderGenre(genre, genreDialog) {
    return html`<tri-value-checkbox
        .allowThreeValues="${genreDialog.options.allowThreeValues}"
        @valueChanged="${(e) => genreDialog.handleGenreSelection(e.detail, genre)}"
        .value="${genreDialog.getValue(genre)}"
        .ignoredState="${genreDialog.options.ignoredState}"
        class="genre-checkbox"
    >
        ${genre.name}
        <div class="remove-genre-button" @click="${(e) => genreDialog.removeGenre(e, genre)}"></div>
    </tri-value-checkbox> `;
}
