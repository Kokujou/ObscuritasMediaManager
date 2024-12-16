import { html } from 'lit-element';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { MusicSortingProperties } from '../../data/music-sorting-properties';
import { TimeSpan } from '../../data/timespan';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { CookingTechnique, Course, Language } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { RecipeFilter } from './recipe-filter';
import { RecipeTimes } from './recipe-filter-options';

export function renderRecipeFilter(this: RecipeFilter) {
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
            <div id="nation-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Cuisine:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('nations', CheckboxState.Require)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('nations', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <side-scrol ler>
                    ${Object.values(Language).map(
                        (lang: Language) =>
                            html` <tri-value-checkbox
                                @valueChanged="${(e: CustomEvent) =>
                                    this.setFilterEntryValue(this.filter.nations, lang, e.detail.value)}"
                                class="icon-container"
                                .value="${this.filter.nations.states[lang]}"
                            >
                                <div class="inline-icon " nation="${lang}"></div>
                            </tri-value-checkbox>`
                    )}
                </side-scrol>
            </div>
            <div id="genre-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Gänge:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('courses', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('courses', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterEntryValue(this.filter.courses, e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.entries(Course).map((x) =>
                        DropDownOption.create({ value: x[0], state: this.filter.courses.states[x[0] as Course], text: x[1] })
                    )}"
                    multiselect
                    useToggle
                    unsetText="Keine Einträge ausgewählt"
                    maxDisplayDepth="5"
                >
                </drop-down>
            </div>
            <div id="genre-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Techniken:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('techniques', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('techniques', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterEntryValue(this.filter.techniques, e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.entries(CookingTechnique).map((x) =>
                        DropDownOption.create({
                            value: x[0],
                            state: this.filter.techniques.states[x[0] as CookingTechnique],
                            text: x[1],
                        })
                    )}"
                    multiselect
                    useToggle
                    unsetText="Keine Einträge ausgewählt"
                    maxDisplayDepth="5"
                >
                </drop-down>
            </div>
            <div id="genre-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Hauptzutat:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setArrayFilter('ingredients', CheckboxState.Ignore)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setArrayFilter('ingredients', CheckboxState.Forbid)}"
                    ></div>
                </div>
                <drop-down
                    @selectionChange="${(e: CustomEvent<{ option: DropDownOption<any> }>) =>
                        this.setFilterEntryValue(this.filter.ingredients, e.detail.option.value, e.detail.option.state)}"
                    .options="${Object.keys(this.filter.ingredients.states).map((x) =>
                        DropDownOption.create({
                            value: x[0],
                            state: this.filter.ingredients.states[x[0]],
                            text: x[1],
                        })
                    )}"
                    multiselect
                    useToggle
                    threeValues
                    unsetText="Keine Einträge ausgewählt"
                    maxDisplayDepth="5"
                >
                </drop-down>
            </div>
            <div class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Maximale Dauer:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.Revert}"
                        tooltip="Zurücksetzen"
                        @click="${() => this.setfilterEntry('maxDuration', new TimeSpan())}"
                    ></div>
                </div>
                <div id="time-filter">
                    <drop-down
                        id="time-dropdown"
                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<keyof typeof RecipeTimes> }>) =>
                            this.setfilterEntry('filterByTime', e.detail.option.value)}"
                        .options="${Object.entries(RecipeTimes).map((x) =>
                            DropDownOption.create({
                                value: x[0],
                                state:
                                    RecipeTimes[this.filter.filterByTime] == x[1] ? CheckboxState.Ignore : CheckboxState.Forbid,
                                text: x[1],
                            })
                        )}"
                        maxDisplayDepth="5"
                    >
                    </drop-down>
                    <duration-input
                        .timespan="${this.filter.maxDuration}"
                        @duration-changed="${(e: CustomEvent<string>) =>
                            this.setfilterEntry('maxDuration', TimeSpan.fromString(e.detail))}"
                    ></duration-input>
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
            <div id="difficulty-filter" class="filter">
                <div class="filter-heading">
                    <div class="heading-label">Schwierigkeit:</div>
                    <div
                        class="icon-button"
                        icon="${Icons.SelectAll}"
                        tooltip="Alle auswählen"
                        @click="${() => this.setfilterEntry('maxDifficulty', 5)}"
                    ></div>
                    <div
                        class="icon-button"
                        icon="${Icons.UnselectAll}"
                        tooltip="Alle abwählen"
                        @click="${() => this.setfilterEntry('maxDifficulty', 0)}"
                    ></div>
                </div>
                <star-rating
                    max="5"
                    singleSelect
                    swords
                    .values="${[...new Array(this.filter.maxDifficulty + 1).keys()]}"
                    @ratingChanged="${(e: CustomEvent<{ rating: number; include: boolean }>) =>
                        this.setfilterEntry('maxDifficulty', e.detail.rating)}"
                ></star-rating>
            </div>
        </div>
    `;
}
