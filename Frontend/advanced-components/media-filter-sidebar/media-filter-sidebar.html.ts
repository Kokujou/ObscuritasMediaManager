import { html } from 'lit';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { ContentWarning, Language, MediaCategory, TargetGroup } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { MediaFilter } from './media-filter';
import { MediaFilterSidebar } from './media-filter-sidebar';

export function renderMediaFilterSidebar(this: MediaFilterSidebar) {
    if (!this.filter) return;
    return html`
        <div id="heading">
            <div id="heading-text">Suche</div>
            <div
                class="icon-button reset-button"
                icon="${Icons.Revert}"
                tooltip="Zurücksetzen"
                @click="${() => this.resetFilter()}"
            ></div>
        </div>
        <div id="filters">
            <div id="search-filter" class="filter-entry" simple>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Bitte Suchbegriff eingeben..."
                    .value="${this.filter.search ?? ''}"
                    oninput="this.dispatchEvent(new Event('change'))"
                    @change="${(e: CustomEvent) =>
                        this.changeFilterProperty('search', (e.currentTarget as HTMLInputElement as HTMLInputElement).value)}"
                />
            </div>
            <div id="deleted" class="filter-entry">
                <div class="filter-heading">Gelöschte anzeigen:</div>
                <custom-toggle
                    id="delete-toggle"
                    .state="${this.filter.deleted}"
                    threeValues
                    @toggle="${(e: CustomEvent<CheckboxState>) => this.changeFilterProperty('deleted', e.detail)}"
                ></custom-toggle>
            </div>
            <div id="deleted" class="filter-entry">
                <div class="filter-heading">Vollständige anzeigen:</div>
                <custom-toggle
                    id="complete-toggle"
                    .state="${this.filter.complete}"
                    threeValues
                    @toggle="${(e: CustomEvent<CheckboxState>) => this.changeFilterProperty('complete', e.detail)}"
                ></custom-toggle>
            </div>
            <div id="sorting" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Sortieren:</div>
                </div>
                <div id="sort-input">
                    <drop-down
                        id="sorting-property-dropdown"
                        .options="${MediaFilter.SortableProperties.map((x) =>
                            DropDownOption.create({
                                value: x,
                                text: x.translation,
                                state: x.property == this.filter.sortingProperty ? CheckboxState.Ignore : CheckboxState.Forbid,
                            })
                        )}"
                        unsetText="Keine Sortierung"
                        maxDisplayDepth="5"
                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                            this.changeFilterProperty('sortingProperty', e.detail.option.value.property)}"
                    >
                    </drop-down>
                    <div
                        id="ascending-icon"
                        ?active="${this.filter.sortingDirection == 'ascending'}"
                        class="icon-button"
                        icon="${Icons.Ascending}"
                        tooltip="Aufsteigend sortieren"
                        @click="${() => this.changeFilterProperty('sortingDirection', 'ascending')}"
                    ></div>
                    <div
                        id="descending-icon"
                        ?active="${this.filter.sortingDirection == 'descending'}"
                        class="icon-button"
                        icon="${Icons.Descending}"
                        tooltip="Absteigend sortieren"
                        @click="${() => this.changeFilterProperty('sortingDirection', 'descending')}"
                    ></div>
                </div>
            </div>
            <div id="language-filter" class="filter-entry" simple>
                <div class="filter-heading">
                    <div class="filter-label">Sprache:</div>
                </div>
                <div id="language-switcher-mini">
                    <tri-value-checkbox
                        @valueChanged="${(e: CustomEvent) =>
                            this.setFilterProperty('languages', Language.German, e.detail.value)}"
                        class="icon-container"
                        .value="${this.filter.languages.states[Language.German]}"
                    >
                        <div class="icon-button" language="${Language.German}"></div>
                    </tri-value-checkbox>
                    <tri-value-checkbox
                        @valueChanged="${(e: CustomEvent) =>
                            this.setFilterProperty('languages', Language.Japanese, e.detail.value)}"
                        class="icon-container"
                        .value="${this.filter.languages.states[Language.Japanese]}"
                    >
                        <div class="icon-button" language="${Language.Japanese}"></div>
                    </tri-value-checkbox>
                </div>
            </div>
            <div id="category-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Kategorie:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('category', 'all', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('category', 'all', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    .options="${Object.values(MediaCategory).map((x) =>
                        DropDownOption.create({ value: x, state: this.filter.category.states[x], text: x })
                    )}"
                    useToggle
                    multiselect
                    maxDisplayDepth="5"
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterProperty('category', e.detail.option.value, e.detail.option.state)}"
                ></drop-down>
            </div>
            <div id="rating-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Bewertung:</div>
                </div>
                <div class="filter-heading">
                    <label for="undefined-rating-toggle">Unbewertete anzeigen:</label>
                    <custom-toggle
                        id="undefined-rating-toggle"
                        .state="${this.filter.ratings.states[0]}"
                        @toggle="${(e: CustomEvent<CheckboxState>) => this.setFilterProperty('ratings', 0, e.detail)}"
                    ></custom-toggle>
                </div>
                <star-rating
                    max="5"
                    .values="${Object.keys(this.filter.ratings.states)
                        .filter(
                            (x) =>
                                this.filter.ratings.states[<keyof MediaFilter['ratings']['states']>(<unknown>x)] ==
                                CheckboxState.Require
                        )
                        .map((x) => Number.parseInt(x))}"
                    @ratingChanged="${(e: CustomEvent) =>
                        this.setFilterProperty(
                            'ratings',
                            e.detail.rating,
                            e.detail.include ? CheckboxState.Require : CheckboxState.Forbid
                        )}"
                ></star-rating>
            </div>
            <div id="genre-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">
                        Genres:
                        <div class="icon-button" icon="${Icons.Popup}" @click="${() => this.openGenreDialog()}"></div>
                    </div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('genres', 'all', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('genres', 'all', CheckboxState.Forbid)}"
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
                    .left="${this.filter.release.min ?? 1900}"
                    .right="${this.filter.release.max ?? new Date().getFullYear()}"
                    @range-changed="${(e: CustomEvent) =>
                        this.changeFilterProperty('release', { min: e.detail.left, max: e.detail.right })}"
                ></range-selector>
            </div>
            <div id="content-warning-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Inhaltswarnungen:</div>
                    <div
                        class="icon-button reset-button"
                        icon="${Icons.Revert}"
                        tooltip="Zurücksetzen"
                        @click="${() => this.setArrayFilter('contentWarnings', 'all', CheckboxState.Ignore)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(ContentWarning).map(
                        (warning) =>
                            html` <tri-value-checkbox
                                allowThreeValues
                                .value="${this.filter.contentWarnings.states[warning]}"
                                @valueChanged="${(e: CustomEvent) =>
                                    this.setFilterProperty('contentWarnings', warning, e.detail.value)}"
                            >
                                <div class="icon-button" content-warning="${warning}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scroller>
            </div>
            <div id="target-group-filter" class="filter-entry" complex>
                <div class="filter-heading">
                    <div class="filter-label">Zielgruppe:</div>
                    <div
                        class="icon-button reset-button"
                        icon="${Icons.Revert}"
                        tooltip="Zurücksetzen"
                        @click="${() => this.setArrayFilter('targetGroups', 'all', CheckboxState.Ignore)}"
                    ></div>
                </div>
                <side-scroller>
                    ${Object.values(TargetGroup).map(
                        (group) => html` <tri-value-checkbox
                            allowThreeValues
                            .value="${this.filter.targetGroups.states[group]}"
                            @valueChanged="${(e: CustomEvent) => this.setFilterProperty('targetGroups', group, e.detail.value)}"
                        >
                            <div class="icon-button" target-group="${group}"></div
                        ></tri-value-checkbox>`
                    )}</side-scroller
                >
            </div>
        </div>
        <slot id="footer" name="footer"></slot>
    `;
}
