import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { html } from '../../exports.js';
import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreDialog } from './genre-dialog.js';

/**
 * @param {GenreDialog} dialog
 */
export function renderGenreDialog(dialog) {
    var filteredSections = Object.keys(dialog.genreDict).filter((section) =>
        dialog.genreDict[section].some(
            (genre) => genre.name.toLowerCase().includes(dialog.searchText.toLowerCase()) || dialog.genreDict[section].length == 0
        )
    );

    return html`
        <dialog-base
            showBorder
            canAccept
            caption="Tags auswählen"
            acceptActionText="Speichern"
            declineActionText="Abbrechen"
            @decline="${() => dialog.remove()}"
            @accept="${(e) => dialog.accept(e)}"
        >
            <div id="dialog-content">
                ${dialog.options.allowRemove
                    ? html` <div id="remove-toggle">
                          <custom-toggle
                              @toggle="${(e) => dialog.toggleAttribute('editModeEnabled', e.detail == CheckboxState.Ignore)}"
                          ></custom-toggle>
                          <div id="toggle-text">Löschen</div>
                      </div>`
                    : ''}

                <input
                    id="search-input"
                    type="text"
                    placeholder="Search"
                    oninput="javascript: this.dispatchEvent(new Event('change'))"
                    @change="${(e) => (dialog.searchText = e.currentTarget.value)}"
                />

                <div id="genre-container">
                    ${filteredSections.map((section) => renderGenreSection(section, dialog.genreDict[section], dialog))}
                    ${filteredSections.length <= 0 ? html`Keine passenden Genres gefunden.` : ''}
                </div>
            </div>
        </dialog-base>
    `;
}

/**
 * @param {string} sectionName
 * @param {GenreModel[]} genres
 * @param {GenreDialog} dialog
 */
function renderGenreSection(sectionName, genres, dialog) {
    return html`<div class="genre-section">
        <div class="section-title">${sectionName}</div>
        <div class="genre-list">
            ${genres
                .filter((x) => x.name.toLowerCase().includes(dialog.searchText.toLowerCase()))
                .map((genre) => renderGenre(genre, dialog))}
            ${dialog.options.allowAdd
                ? html`<div id="add-genre-button" @click="${() => dialog.addGenre(sectionName)}">+</div>`
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
