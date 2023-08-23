import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { MoodColors } from '../../data/enumerations/mood.js';
import { MusicSortingProperties } from '../../data/music-sorting-properties.js';
import { html } from '../../exports.js';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option.js';
import {
    Instrumentation,
    InstrumentType,
    Mood,
    MusicGenre,
    Nation,
    Participants,
} from '../../obscuritas-media-manager-backend-client.js';
import { IconRegistry } from '../../resources/inline-icons/icon-registry.js';
import { MusicFilter } from './music-filter.js';

/**
 * @param {MusicFilter} musicFilter
 */
export function renderMusicFilter(musicFilter) {
    return html`
        <div id="search-heading">
            <div class="heading-label">Suche</div>
            <div class="icon-button ${IconRegistry.RevertIcon}" @click="${() => musicFilter.resetAllFilters()}"></div>
        </div>
        <div id="search-panel">
            <div id="text-filter" class="filter">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Suchbegriff eingeben..."
                    oninput="this.dispatchEvent(new Event('change'))"
                    @change="${(e) => musicFilter.toggleFilter('search', '', e.target.value)}"
                    .value="${musicFilter.filter.search || ''}"
                />
            </div>
            <div id="complete-filter" class="filter">
                <label for="scales">Vollständig: </label>
                <tri-value-checkbox
                    allowThreeValues
                    id="complete-input"
                    value="${musicFilter.filter.complete}"
                    @valueChanged="${(e) => musicFilter.toggleFilter('complete', '', e.detail.value)}"
                ></tri-value-checkbox>
            </div>
            <div id="show-playlists-filter" class="filter">
                <label for="scales">Playlists anzeigen: </label>
                <tri-value-checkbox
                    allowThreeValues
                    id="show-playlists-input"
                    value="${musicFilter.filter.showPlaylists}"
                    @valueChanged="${(e) => musicFilter.toggleFilter('showPlaylists', '', e.detail.value)}"
                ></tri-value-checkbox>
            </div>
            <div id="mood-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Sortieren:</div>
                    <div
                        class="icon-button ${IconRegistry.RevertIcon}"
                        @click="${() => musicFilter.changeSorting('unset')}"
                    ></div>
                </div>
                <div id="sorting-container">
                    <drop-down
                        .options="${Object.entries(MusicSortingProperties).map((x) =>
                            DropDownOption.create({
                                value: x[0],
                                text: x[1],
                                state: x[0] == musicFilter.sortingProperty ? CheckboxState.Ignore : CheckboxState.Forbid,
                            })
                        )}"
                        unsetText="Keine Sortierung"
                        maxDisplayDepth="5"
                        @selectionChange="${(e) => musicFilter.changeSorting(e.detail.option.value)}"
                    >
                    </drop-down>
                    <div
                        id="ascending-icon"
                        ?active="${musicFilter.sortingDirection == 'ascending'}"
                        class="icon-button ${IconRegistry.AscendingIcon}"
                        @click="${() => musicFilter.changeSorting(null, 'ascending')}"
                    ></div>
                    <div
                        id="descending-icon"
                        ?active="${musicFilter.sortingDirection == 'descending'}"
                        class="icon-button ${IconRegistry.DescendingIcon}"
                        @click="${() => musicFilter.changeSorting(null, 'descending')}"
                    ></div>
                </div>
            </div>
            <div id="language-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Sprache:</div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('languages', CheckboxState.Allow)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('languages', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(Nation).map(
                        (type) =>
                            html` <tri-value-checkbox
                                @valueChanged="${(e) => musicFilter.toggleFilter('languages', type, e.detail.value)}"
                                class="icon-container"
                                .value="${musicFilter.filter.languages.states[type]}"
                            >
                                <div class="inline-icon " language="${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="nation-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Herkunftsland:</div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('nations', CheckboxState.Allow)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('nations', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(Nation).map(
                        (type) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                @valueChanged="${(e) => musicFilter.toggleFilter('nations', type, e.detail.value)}"
                                .value="${musicFilter.filter.nations.states[type]}"
                            >
                                <div class="inline-icon" nation="${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
                <div id="instrument-type-filter" class="filter">
                    <div class="filter-heading">
                        <div class="heading-label">Instrument Typen:</div>
                        <div
                            class="icon-button ${IconRegistry.SelectAllIcon}"
                            @click="${() => musicFilter.setArrayFilter('instrumentTypes', CheckboxState.Allow)}"
                        ></div>
                        <div
                            class="icon-button ${IconRegistry.UnselectAllIcon}"
                            @click="${() => musicFilter.setArrayFilter('instrumentTypes', CheckboxState.Forbid)}"
                        ></div>
                        <div
                            class="icon-button ${IconRegistry.RevertIcon}"
                            @click="${() => musicFilter.setArrayFilter('instrumentTypes', CheckboxState.Ignore)}"
                        ></div>
                    </div>
                    <side-scroller>
                        ${Object.values(InstrumentType).map(
                            (type) =>
                                html` <tri-value-checkbox
                                    class="icon-container"
                                    allowThreeValues
                                    @valueChanged="${(e) => musicFilter.toggleFilter('instrumentTypes', type, e.detail.value)}"
                                    .value="${musicFilter.filter.instrumentTypes.states[type]}"
                                    .disabled="${!musicFilter.canFilterInstrumentType(type)}"
                                >
                                    <div class="inline-icon ${type}"></div>
                                </tri-value-checkbox>`
                        )}
                    </side-scroller>
                </div>
            </div>
            <div id="instrument-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Instrumente:</div>
                    <div
                        class="icon-button ${IconRegistry.PopupIcon}"
                        @click="${() => musicFilter.showInstrumentFilterPopup()}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('instruments', CheckboxState.Allow)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('instruments', CheckboxState.Forbid)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.RevertIcon}"
                        @click="${() => musicFilter.setArrayFilter('instruments', CheckboxState.Ignore)}"
                    ></div>
                </div>
            </div>
            <div id="rating-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Bewertung:</div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('ratings', CheckboxState.Allow)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('ratings', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <star-rating
                    max="5"
                    .values="${Object.keys(musicFilter.filter.ratings.states)
                        .filter((x) => musicFilter.filter.ratings.states[x] == CheckboxState.Allow)
                        .map((x) => Number.parseInt(x))}"
                    @ratingChanged="${(e) =>
                        musicFilter.toggleFilter(
                            'ratings',
                            `${e.detail.rating}`,
                            e.detail.include ? CheckboxState.Allow : CheckboxState.Forbid
                        )}"
                ></star-rating>
            </div>
            <div id="mood-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Stimmung:</div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('moods', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('moods', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.toggleFilter('moods', e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.entries(Mood).map((x) =>
                        DropDownOption.create({
                            value: x[0],
                            text: x[1],
                            color: MoodColors[x[0]],
                            state: musicFilter.filter.moods.states[x[0]],
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
                    <div class="heading-label">genres:</div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('genres', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('genres', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.toggleFilter('genres', e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.entries(MusicGenre).map((x) =>
                        DropDownOption.create({ value: x[0], state: musicFilter.filter.genres.states[x[0]], text: x[1] })
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
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('instrumentations', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('instrumentations', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e) =>
                        musicFilter.toggleFilter('instrumentations', e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.values(Instrumentation).map((key) =>
                        DropDownOption.create({ value: key, text: key, state: musicFilter.filter.instrumentations.states[key] })
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
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('participants', CheckboxState.Allow)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => musicFilter.setArrayFilter('participants', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(Participants).map(
                        (type) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                @valueChanged="${(e) => musicFilter.toggleFilter('participants', type, e.detail.value)}"
                                .value="${musicFilter.filter.participants.states[type]}"
                            >
                                <div class="inline-icon ${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
        </div>
    `;
}
