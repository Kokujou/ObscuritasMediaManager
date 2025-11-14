import { html } from 'lit';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { MoodColors } from '../../data/enumerations/mood';
import { MusicSortingProperties } from '../../data/music-sorting-properties';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import {
    Instrumentation,
    InstrumentType,
    Language,
    Mood,
    MusicGenre,
    Participants,
} from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { MusicFilter } from './music-filter';

export function renderMusicFilter(this: MusicFilter) {
    return html`
        <div id="search-heading">
            <div class="heading-label">Suche</div>
            <div class="icon-button" icon="${Icons.Revert}" tooltip="Zurücksetzen" @click="${() => this.resetAllFilters()}"></div>
        </div>
        <div id="search-panel">
            <div id="text-filter" class="filter" simple>
                <input
                    type="text"
                    id="search-input"
                    placeholder="Suchbegriff eingeben..."
                    oninput="this.dispatchEvent(new Event('change'))"
                    @change="${(e: CustomEvent) =>
                        this.setfilterEntry('search', (e.target as HTMLInputElement as HTMLInputElement).value)}"
                    .value="${this.filter.search || ''}"
                />
            </div>
            <div id="complete-filter" class="filter" simple>
                <label for="scales">Vollständig: </label>
                <custom-toggle
                    id="show-complete-toggle"
                    .state="${this.filter.showComplete}"
                    threeValues
                    @toggle="${(e: CustomEvent<CheckboxState>) => this.setfilterEntry('showComplete', e.detail)}"
                ></custom-toggle>
            </div>
            <div id="show-playlists-filter" class="filter" simple>
                <label for="scales">Playlists anzeigen: </label>
                <custom-toggle
                    id="show-playlists-toggle"
                    .state="${this.filter.showPlaylists}"
                    threeValues
                    @toggle="${(e: CustomEvent<CheckboxState>) => this.setfilterEntry('showPlaylists', e.detail)}"
                ></custom-toggle>
            </div>
            <div id="show-deleted-filter" class="filter" simple>
                <label for="scales">Gelöschte anzeigen: </label>
                <custom-toggle
                    id="show-deleted-toggle"
                    .state="${this.filter.showDeleted}"
                    threeValues
                    @toggle="${(e: CustomEvent<CheckboxState>) => this.setfilterEntry('showDeleted', e.detail)}"
                ></custom-toggle>
            </div>
            <div id="mood-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Sortieren:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.Revert}"
                        tooltip="Zurücksetzen"
                        @click="${() => this.changeSorting('unset')}"
                    ></div>
                </div>
                <div id="sorting-container">
                    <drop-down
                        .options="${Object.entries(MusicSortingProperties).map((x) =>
                            DropDownOption.create({
                                value: x[0],
                                text: x[1],
                                state: x[0] == this.sortingProperty ? CheckboxState.Ignore : CheckboxState.Forbid,
                            })
                        )}"
                        unsetText="Keine Sortierung"
                        maxDisplayDepth="5"
                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                            this.changeSorting(e.detail.option.value)}"
                    >
                    </drop-down>
                    <div
                        id="ascending-icon"
                        ?active="${this.sortingDirection == 'ascending'}"
                        class="icon-button"
                        icon="${Icons.Ascending}"
                        tooltip="Aufsteigend sortieren"
                        @click="${() => this.changeSorting(null, 'ascending')}"
                    ></div>
                    <div
                        id="descending-icon"
                        ?active="${this.sortingDirection == 'descending'}"
                        class="icon-button"
                        icon="${Icons.Descending}"
                        tooltip="Absteigend sortieren"
                        @click="${() => this.changeSorting(null, 'descending')}"
                    ></div>
                </div>
            </div>
            <div id="language-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Sprache:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('languages', CheckboxState.Require)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('languages', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(Language).map(
                        (lang: Language) =>
                            html` <tri-value-checkbox
                                @valueChanged="${(e: CustomEvent) =>
                                    this.setFilterEntryValue(this.filter.languages, lang, e.detail.value)}"
                                class="icon-container"
                                .value="${this.filter.languages.states[lang]}"
                            >
                                <div class="inline-icon " language="${lang}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="instrument-type-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Instrument Typen:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('instrumentTypes', CheckboxState.Require)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('instrumentTypes', CheckboxState.Forbid)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.Revert}"
                        tooltip="Zurücksetzen"
                        @click="${() => this.setArrayFilter('instrumentTypes', CheckboxState.Ignore)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(InstrumentType).map(
                        (type: InstrumentType) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                allowThreeValues
                                @valueChanged="${(e: CustomEvent) =>
                                    this.setFilterEntryValue(this.filter.instrumentTypes, type, e.detail.value)}"
                                .value="${this.filter.instrumentTypes.states[type]}"
                                .disabled="${!this.canFilterInstrumentType(type)}"
                            >
                                <div class="inline-icon" instrument-type="${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="instrument-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Instrumente:</div>
                    <div class="icon-button" icon="${Icons.Popup}" @click="${() => this.showInstrumentFilterPopup()}"></div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('instruments', CheckboxState.Require)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('instruments', CheckboxState.Forbid)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.Revert}"
                        tooltip="Zurücksetzen"
                        @click="${() => this.setArrayFilter('instruments', CheckboxState.Ignore)}"
                    ></div>
                </div>
            </div>
            <div id="rating-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Bewertung:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('ratings', CheckboxState.Require)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('ratings', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <div class="filter-row">
                    <div class="filter-label">Show undefined:</div>
                    <custom-toggle
                        .state="${this.filter.ratings.states[0]}"
                        @toggle="${(e: CustomEvent<CheckboxState>) =>
                            this.setFilterEntryValue(this.filter.ratings, '0', e.detail)}"
                    ></custom-toggle>
                </div>
                <star-rating
                    max="5"
                    .values="${this.filter.ratings.ignored.map((x) => Number.parseInt(x))}"
                    @ratingChanged="${(e: CustomEvent) =>
                        this.setFilterEntryValue(
                            this.filter.ratings,
                            e.detail.rating,
                            e.detail.include ? CheckboxState.Ignore : CheckboxState.Forbid
                        )}"
                ></star-rating>
            </div>
            <div id="mood-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Stimmung:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('moods', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('moods', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterEntryValue(this.filter.moods, e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.entries(Mood).map((x) =>
                        DropDownOption.create({
                            value: x[0],
                            text: x[1],
                            color: MoodColors[x[0] as Mood],
                            state: this.filter.moods.states[x[0] as Mood],
                        })
                    )}"
                    unsetText="Keine Einträge ausgewählt"
                    multiselect
                    threeValues
                    useToggle
                    maxDisplayDepth="5"
                >
                </drop-down>
            </div>
            <div id="genre-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Genres:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('genres', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('genres', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterEntryValue(this.filter.genres, e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.entries(MusicGenre).map((x) =>
                        DropDownOption.create({ value: x[0], state: this.filter.genres.states[x[0] as MusicGenre], text: x[1] })
                    )}"
                    multiselect
                    useToggle
                    threeValues
                    unsetText="Keine Einträge ausgewählt"
                    maxDisplayDepth="5"
                >
                </drop-down>
            </div>
            <div id="instrumentation-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Instrumentverteilung:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('instrumentations', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('instrumentations', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterEntryValue(this.filter.instrumentations, e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.values(Instrumentation).map((key) =>
                        DropDownOption.create({ value: key, text: key, state: this.filter.instrumentations.states[key] })
                    )}"
                    useToggle
                    multiselect
                    maxDisplayDepth="5"
                >
                </drop-down>
            </div>
            <div id="participant-count-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Mitgliederzahl:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('participants', CheckboxState.Require)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('participants', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(Participants).map(
                        (participants) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                @valueChanged="${(e: CustomEvent) =>
                                    this.setFilterEntryValue(this.filter.participants, participants, e.detail.value)}"
                                .value="${this.filter.participants.states[participants]}"
                            >
                                <div class="inline-icon" participants="${participants}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
        </div>
    `;
}
