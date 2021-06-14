import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { InstrumentTypes } from '../../data/enumerations/instrument-types.js';
import { Instrumentation } from '../../data/enumerations/instrumentation.js';
import { Mood } from '../../data/enumerations/mood.js';
import { Nations } from '../../data/enumerations/nations.js';
import { Participants } from '../../data/enumerations/participants.js';
import { html } from '../../exports.js';
import { MusicFilter } from './music-filter.js';

/**
 * @param {MusicFilter} musicFilter
 */
export function renderMusicFilter(musicFilter) {
    return html`
        <div id="search-heading">Suche</div>
        <div id="search-panel">
            <div id="language-filter" class="filter">
                <div class="filter-heading">Sprache:</div>
                <side-scroller>
                    ${Object.values(Nations).map(
                        (type) =>
                            html` <tri-value-checkbox
                                ?allowThreeValues="${false}"
                                @valueChanged="${(e) => musicFilter.toggleFilter('languages', type, e.detail.value)}"
                                class="icon-container"
                                class=""
                            >
                                <div class="inline-icon ${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="nation-filter" class="filter">
                <div class="filter-heading">Herkunftsland:</div>
                <side-scroller>
                    ${Object.values(Nations).map(
                        (type) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                ?allowThreeValues="${false}"
                                @valueChanged="${(e) => musicFilter.toggleFilter('nations', type, e.detail.value)}"
                            >
                                <div class="inline-icon ${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
                <div id="instrument-type-filter" class="filter">
                    <div class="filter-heading">Instrumenten-Typen:</div>
                    <side-scroller>
                        ${Object.values(InstrumentTypes).map(
                            (type) =>
                                html` <tri-value-checkbox
                                    class="icon-container"
                                    ?allowThreeValues="${true}"
                                    @valueChanged="${(e) => musicFilter.toggleFilter('instrumentTypes', type, e.detail.value)}"
                                >
                                    <div class="inline-icon ${type}"></div>
                                </tri-value-checkbox>`
                        )}
                    </side-scroller>
                </div>
            </div>
            <div id="instrument-filter" class="filter">
                <div class="filter-heading">Instrumente:</div>
            </div>
            <div id="mood-filter" class="filter">
                <div class="filter-heading">Stimmung:</div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('moods', 'mood', e.detail.value)}"
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
                <div class="filter-heading">Genre:</div>
            </div>
            <div id="instrumentation-filter" class="filter">
                <div class="filter-heading">Verteilung der Instrumente:</div>
                <drop-down
                    @selectionChange="${(e) => musicFilter.handleDropdownChange('instrumentations', 'instrumentation', e.detail.value)}"
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
                <div class="filter-heading">Mitgliederzahl:</div>
                <side-scroller>
                    ${Object.values(Participants).map(
                        (type) =>
                            html` <tri-value-checkbox
                                class="icon-container"
                                ?allowThreeValues="${false}"
                                @valueChanged="${(e) => musicFilter.toggleFilter('participants', type, e.detail.value)}"
                            >
                                <div class="inline-icon ${type}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
        </div>
    `;
}
