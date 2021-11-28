import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { MoodColors } from '../../data/enumerations/mood.js';
import { html } from '../../exports.js';
import {
    Instrumentation,
    InstrumentType,
    Mood,
    MusicGenre,
    Nation,
    Participants,
} from '../../obscuritas-media-manager-backend-client.js';
import { MusicFilter } from './music-filter.js';

/**
 * @param {MusicFilter} musicFilter
 */
export function renderMusicFilter(musicFilter) {
    return html`
        <div id="search-heading">
            <div id="heading-label">Suche</div>
            <div class="inline-icon reset-icon" @click="${() => musicFilter.resetAllFilters()}"></div>
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
            <div id="language-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Sprache:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('languages')}"></div>
                </div>
                <side-scroller>
                    ${Object.values(Nation).map(
                        (type) =>
                            html` <tri-value-checkbox
                                @valueChanged="${(e) => musicFilter.toggleFilter('languages', type, e.detail.value)}"
                                class="icon-container"
                                .value="${musicFilter.filter.languages.states[type]}"
                            >
                                <div class="inline-icon ${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="nation-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Herkunftsland:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('nations')}"></div>
                </div>
                <side-scroller>
                    ${Object.values(Nation).map(
                        (type) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                @valueChanged="${(e) => musicFilter.toggleFilter('nations', type, e.detail.value)}"
                                .value="${musicFilter.filter.nations.states[type]}"
                            >
                                <div class="inline-icon ${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
                <div id="instrument-type-filter" class="filter">
                    <div class="filter-heading">
                        <div id="heading-label">Instrument Typen:</div>
                        <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('instrumentTypes')}"></div>
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
                    <div id="heading-label">Instrumente:</div>
                    <div class="inline-icon popup-icon" @click="${() => musicFilter.showInstrumentFilterPopup()}"></div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('instruments')}"></div>
                </div>
            </div>
            <div id="rating-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Bewertung:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('ratings')}"></div>
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
                    <div id="heading-label">Stimmung:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('moods')}"></div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('moods', e.detail.value)}"
                    .values="${Object.keys(musicFilter.filter.moods.states).filter(
                        (key) => musicFilter.filter.moods.states[key] == CheckboxState.Ignore
                    )}"
                    multiselect
                    maxDisplayDepth="5"
                    .options="${Object.values(Mood)}"
                    .colors="${MoodColors}"
                >
                </drop-down>
            </div>
            <div id="genre-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">genres:</div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('genres', e.detail.value)}"
                    .values="${Object.keys(musicFilter.filter.genres.states).filter(
                        (key) => musicFilter.filter.genres.states[key] == CheckboxState.Ignore
                    )}"
                    multiselect
                    maxDisplayDepth="5"
                    .options="${Object.values(MusicGenre)}"
                >
                </drop-down>
            </div>
            <div id="instrumentation-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Verteilung der Instrumente:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('instrumentations')}"></div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('instrumentations', e.detail.value)}"
                    .values="${Object.keys(musicFilter.filter.instrumentations.states).filter(
                        (key) => musicFilter.filter.instrumentations.states[key] == CheckboxState.Ignore
                    )}"
                    multiselect
                    maxDisplayDepth="5"
                    .options="${Object.values(Instrumentation)}"
                >
                </drop-down>
            </div>
            <div id="participant-count-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Mitgliederzahl:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('participants')}"></div>
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
