import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { InstrumentTypes } from '../../data/enumerations/instrument-types.js';
import { Instrumentation } from '../../data/enumerations/instrumentation.js';
import { Mood } from '../../data/enumerations/mood.js';
import { Nation } from '../../data/enumerations/nation.js';
import { Participants } from '../../data/enumerations/participants.js';
import { html } from '../../exports.js';
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
            <div id="language-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Sprache:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('languages')}"></div>
                </div>
                <side-scroller>
                    ${Object.values(Nation).map(
                        (type) =>
                            html` <tri-value-checkbox
                                ?allowThreeValues="${false}"
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
                                ?allowThreeValues="${false}"
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
                        ${Object.values(InstrumentTypes).map(
                            (type) =>
                                html` <tri-value-checkbox
                                    class="icon-container"
                                    ?allowThreeValues="${true}"
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
            <div id="mood-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Stimmung:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('moods')}"></div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('moods', e.detail.value)}"
                    .values="${Object.keys(musicFilter.filter.moods.states).filter(
                        (key) => musicFilter.filter.moods.states[key] == CheckboxState.Allow
                    )}"
                    multiselect
                    useSearch
                    maxDisplayDepth="5"
                    .options="${Object.values(Mood)}"
                >
                </drop-down>
            </div>
            <div id="genre-filter" class="filter">
                <div class="filter-heading"><div id="heading-label">genres:</div></div>
            </div>
            <div id="instrumentation-filter" class="filter">
                <div class="filter-heading">
                    <div id="heading-label">Verteilung der Instrumente:</div>
                    <div class="inline-icon reset-icon" @click="${() => musicFilter.resetFilter('instrumentations')}"></div>
                </div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('instrumentations', e.detail.value)}"
                    .values="${Object.keys(musicFilter.filter.instrumentations.states).filter(
                        (key) => musicFilter.filter.instrumentations.states[key] == CheckboxState.Allow
                    )}"
                    multiselect
                    useSearch
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
                                ?allowThreeValues="${false}"
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
