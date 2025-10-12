import { html } from 'lit-element';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { GenreModel } from '../../obscuritas-media-manager-backend-client';
import { GenreDialog } from './genre-dialog';

export function renderGenreDialog(this: GenreDialog) {
    const genreDict = this.options.genres.groupByKey('sectionName');
    var filteredSections = Object.keys(genreDict).filter((section) =>
        genreDict[section].some(
            (genre) => genre.name.toLowerCase().includes(this.searchText.toLowerCase()) || genreDict[section].length == 0
        )
    );

    return html`
        <dialog-base
            showBorder
            canAccept
            caption="Tags auswählen"
            acceptActionText="Speichern"
            declineActionText="Abbrechen"
            @decline="${() => this.remove()}"
            @accept="${(e: Event) => this.accept(e)}"
        >
            <div id="dialog-content">
                ${this.options.allowRemove
                    ? html` <div id="remove-toggle">
                          <custom-toggle
                              @toggle="${(e: CustomEvent<CheckboxState>) =>
                                  this.toggleAttribute('editModeEnabled', e.detail == CheckboxState.Ignore)}"
                          ></custom-toggle>
                          <div id="toggle-text">Löschen</div>
                      </div>`
                    : ''}

                <input
                    id="search-input"
                    type="text"
                    placeholder="Search"
                    oninput="javascript: this.dispatchEvent(new Event('change'))"
                    @change="${(e: Event) => (this.searchText = (e.currentTarget as HTMLInputElement).value)}"
                />

                <div id="genre-container">
                    ${filteredSections.map((section) => renderGenreSection.call(this, section, genreDict[section]))}
                    ${filteredSections.length <= 0 ? html`Keine passenden Genres gefunden.` : ''}
                </div>
            </div>
        </dialog-base>
    `;
}

function renderGenreSection(this: GenreDialog, sectionName: string, genres: GenreModel[]) {
    return html`<div class="genre-section">
        <div class="section-title">${sectionName}</div>
        <div class="genre-list">
            ${genres
                .filter((x) => x.name.toLowerCase().includes(this.searchText.toLowerCase()))
                .map((genre) => renderGenre.call(this, genre))}
            ${this.options.allowAdd ? html`<div id="add-genre-button" @click="${() => this.addGenre(sectionName)}">+</div>` : ''}
        </div>
    </div>`;
}

function renderGenre(this: GenreDialog, genre: GenreModel) {
    return html`<tri-value-checkbox
        ?allowThreeValues="${this.options.allowThreeValues}"
        @valueChanged="${(e: CustomEvent<{ value: CheckboxState }>) => this.handleGenreSelection(e.detail, genre)}"
        .value="${this.getValue(genre)}"
        .ignoredState="${this.options.ignoredState}"
        class="genre-checkbox"
    >
        ${genre.name}
        <div class="remove-genre-button" @click="${(e: Event) => this.removeGenre(e, genre)}"></div>
    </tri-value-checkbox> `;
}
