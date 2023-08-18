import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { html } from '../../exports.js';
import { ContentWarning, MediaCategory, Nation, TargetGroup } from '../../obscuritas-media-manager-backend-client.js';
import { IconRegistry } from '../../resources/icons/icon-registry.js';
import { MediaFilterSidebar } from './media-filter-sidebar.js';
import { MediaFilter } from './media-filter.js';

/**
 * @param { MediaFilterSidebar } sidebar
 */
export function renderMediaFilterSidebar(sidebar) {
    return html`
        <div id="heading">
            <div id="heading-text">Suche</div>
            <div class="icon-button reset-button" @click="${() => sidebar.resetFilter()}"></div>
        </div>
        <div id="filters">
            <div id="search-filter" class="filter-entry" simple>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Bitte Suchbegriff eingeben..."
                    .value="${sidebar.filter.search ?? ''}"
                    oninput="this.dispatchEvent(new Event('change'))"
                    @change="${(e) => sidebar.changeFilterProperty('search', e.currentTarget.value)}"
                />
            </div>
            <div id="sorting" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Sortieren:</div>
                </div>
                <div id="sort-input">
                    <drop-down
                        id="sorting-property-dropdown"
                        .value="${MediaFilter.SortableProperties.find((x) => x.property == sidebar.filter.sortingProperty)
                            ?.translation ?? 'Keine Sortierung'}"
                        maxDisplayDepth="5"
                        .options="${MediaFilter.SortableProperties.map((x) => x.translation)}"
                        @selectionChange="${(e) =>
                            sidebar.changeFilterProperty(
                                'sortingProperty',
                                MediaFilter.SortableProperties.find((x) => x.translation == e.detail.value)?.property
                            )}"
                    >
                    </drop-down>
                    <div
                        id="ascending-icon"
                        ?active="${sidebar.filter.sortingDirection == 'ascending'}"
                        class="icon-button ${IconRegistry.AscendingIcon}"
                        @click="${() => sidebar.changeFilterProperty('sortingDirection', 'ascending')}"
                    ></div>
                    <div
                        id="descending-icon"
                        ?active="${sidebar.filter.sortingDirection == 'descending'}"
                        class="icon-button ${IconRegistry.DescendingIcon}"
                        @click="${() => sidebar.changeFilterProperty('sortingDirection', 'descending')}"
                    ></div>
                </div>
            </div>
            <div id="language-filter" class="filter-entry" simple>
                <div class="filter-heading">
                    <div class="filter-label">Sprache:</div>
                </div>
                <div id="language-switcher-mini">
                    <tri-value-checkbox
                        @valueChanged="${(e) => sidebar.setFilterProperty('languages', Nation.German, e.detail.value)}"
                        class="icon-container"
                        .value="${sidebar.filter.languages.states[Nation.German]}"
                    >
                        <div class="icon-button" language="${Nation.German}"></div>
                    </tri-value-checkbox>
                    <tri-value-checkbox
                        @valueChanged="${(e) => sidebar.setFilterProperty('languages', Nation.Japanese, e.detail.value)}"
                        class="icon-container"
                        .value="${sidebar.filter.languages.states[Nation.Japanese]}"
                    >
                        <div class="icon-button" language="${Nation.Japanese}"></div>
                    </tri-value-checkbox>
                </div>
            </div>
            <div id="category-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Kategorie:</div>
                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => sidebar.setArrayFilter('category', 'all', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => sidebar.setArrayFilter('category', 'all', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    .values="${Object.entries(sidebar.filter.category.states)
                        .filter((x) => x[1] == CheckboxState.Ignore)
                        .map((x) => x[0])}"
                    .options="${Object.values(MediaCategory)}"
                    multiselect
                    maxDisplayDepth="5"
                    @selectionChange="${(e) => sidebar.handleDropdownChange('category', e.detail.value)}"
                ></drop-down>
            </div>
            <div id="rating-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Bewertung:</div>
                </div>
                <star-rating
                    max="5"
                    .values="${Object.keys(sidebar.filter.ratings.states)
                        .filter((x) => sidebar.filter.ratings.states[x] == CheckboxState.Allow)
                        .map((x) => Number.parseInt(x))}"
                    @ratingChanged="${(e) =>
                        sidebar.setFilterProperty(
                            'ratings',
                            e.detail.rating,
                            e.detail.include ? CheckboxState.Allow : CheckboxState.Forbid
                        )}"
                ></star-rating>
            </div>
            <div id="genre-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">
                        Genres:
                        <div class="icon-button ${IconRegistry.PopupIcon}" @click="${() => sidebar.openGenreDialog()}"></div>
                    </div>

                    <div
                        class="icon-button ${IconRegistry.SelectAllIcon}"
                        @click="${() => sidebar.setArrayFilter('genres', 'all', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button ${IconRegistry.UnselectAllIcon}"
                        @click="${() => sidebar.setArrayFilter('genres', 'all', CheckboxState.Forbid)}"
                    ></div>
                </div>
            </div>
            <div id="release-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Release:</div>
                </div>
                <range-selector
                    id="release-range-selector"
                    min="1900"
                    max="${new Date().getFullYear()}"
                    .left="${sidebar.filter.release.min ?? 1900}"
                    .right="${sidebar.filter.release.max ?? new Date().getFullYear()}"
                    @range-changed="${(e) =>
                        sidebar.changeFilterProperty('release', { min: e.detail.left, max: e.detail.right })}"
                ></range-selector>
            </div>
            <div id="content-warning-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Inhaltswarnungen:</div>
                </div>
                <side-scroller>
                    ${Object.values(ContentWarning).map(
                        (warning) =>
                            html` <tri-value-checkbox
                                allowThreeValues
                                .value="${sidebar.filter.contentWarnings.states[warning]}"
                                @valueChanged="${(e) => sidebar.setFilterProperty('contentWarnings', warning, e.detail.value)}"
                                ><div class="icon-button" content-warning="${warning}"></div
                            ></tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="target-group-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Zielgruppe:</div>
                </div>
                <side-scroller>
                    ${Object.values(TargetGroup).map(
                        (group) => html` <tri-value-checkbox
                            allowThreeValues
                            .value="${sidebar.filter.targetGroups.states[group]}"
                            @valueChanged="${(e) => sidebar.setFilterProperty('targetGroups', group, e.detail.value)}"
                        >
                            <div class="icon-button" target-group="${group}"></div
                        ></tri-value-checkbox>`
                    )}</side-scroller
                >
            </div>
        </div>
    `;
}
