import { customElement, property } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { FilterEntry } from '../../data/filter-entry';
import { LitElementBase } from '../../data/lit-element-base';
import { MusicSortingProperties, SortingProperties } from '../../data/music-sorting-properties';
import { Session } from '../../data/session';
import { SortingDirections } from '../../data/sorting-directions';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog';
import { InstrumentType, MusicModel } from '../../obscuritas-media-manager-backend-client';
import { KeyOfType } from '../../services/object-filter.service';
import { MusicFilterOptions } from './music-filter-options';
import { renderMusicFilterStyles } from './music-filter.css';
import { renderMusicFilter } from './music-filter.html';

@customElement('music-filter')
export class MusicFilter extends LitElementBase {
    static override get styles() {
        return renderMusicFilterStyles();
    }

    @property({ type: Object }) public declare filter: MusicFilterOptions;
    @property() public declare sortingProperty: SortingProperties;
    @property() public declare sortingDirection: keyof typeof SortingDirections;

    constructor() {
        super();
        this.filter = new MusicFilterOptions();
        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
        if (
            !Object.keys(MusicSortingProperties).every((property) =>
                Object.keys(new MusicModel()).concat(['unset']).includes(property)
            )
        ) {
            var missingProperties = Object.keys(MusicSortingProperties).filter((property) =>
                Object.keys(new MusicModel()).concat(['unset'])
            );
            alert("mismatch in sorting properties, the object might've changed:" + missingProperties);
            throw new Error("mismatch in sorting properties, the object might've changed" + missingProperties);
        }
    }

    override connectedCallback() {
        super.connectedCallback();

        this.subscriptions.push(
            Session.instruments.subscribe((newValue) => {
                if (!newValue) return;

                for (var instrument of newValue) {
                    if (!this.filter.instruments.states[instrument.name])
                        this.filter.instruments.states[instrument.name] = CheckboxState.Ignore;
                }
                this.requestFullUpdate();
            })
        );
    }

    override render() {
        return renderMusicFilter.call(this);
    }

    setFilterEntryValue<T extends string | number | symbol>(
        filter: FilterEntry<T>,
        enumKey: keyof FilterEntry<T>['states'],
        state: CheckboxState
    ) {
        filter.states[enumKey] = state;
        this.requestFullUpdate();
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    setfilterEntry<T extends Exclude<keyof MusicFilterOptions, KeyOfType<MusicFilterOptions, FilterEntry<any>>>>(
        filter: T,
        state: MusicFilterOptions[T]
    ) {
        this.filter[filter] = state;
        this.requestFullUpdate();
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    setArrayFilter<T extends KeyOfType<MusicFilterOptions, FilterEntry<any>>>(filter: T, value: CheckboxState) {
        for (var key in this.filter[filter].states) (this.filter[filter] as FilterEntry<any>).states[key as any] = value;
        this.requestFullUpdate();
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    resetAllFilters() {
        this.filter = new MusicFilterOptions();
        this.sortingDirection = 'ascending';
        this.sortingProperty = 'unset';
        this.requestFullUpdate();
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
        this.dispatchEvent(
            new CustomEvent('sortingUpdated', {
                detail: {
                    property: this.sortingProperty,
                    direction: this.sortingDirection,
                },
            })
        );
    }

    handleDropdownChange<T extends KeyOfType<MusicFilterOptions, FilterEntry<any>>>(filter: T, selectedValues: string[]) {
        Object.keys(this.filter[filter].states).forEach((key) => {
            this.setFilterEntryValue(
                this.filter[filter],
                key,
                selectedValues.includes(key) ? CheckboxState.Ignore : CheckboxState.Forbid
            );
        });
    }

    async showInstrumentFilterPopup() {
        var genreDialog = await GenreDialog.startShowingWithInstruments(this.filter.instruments);

        genreDialog.addEventListener('accept', (e: CustomEvent<GenreDialogResult>) => {
            for (var key of Object.keys(this.filter.instruments.states)) {
                this.filter.instruments.states[key] = CheckboxState.Ignore;
            }
            for (var allowed of e.detail.acceptedGenres) {
                this.filter.instruments.states[allowed.name] = CheckboxState.Require;
                this.filter.instrumentTypes.states[allowed.sectionName as InstrumentType] = CheckboxState.Require;
            }
            for (var forbidden of e.detail.forbiddenGenres) {
                this.filter.instruments.states[forbidden.name] = CheckboxState.Forbid;
            }

            this.requestFullUpdate();
            this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
            genreDialog.remove();
        });
        genreDialog.addEventListener('decline', () => {
            genreDialog.remove();
        });
    }

    canFilterInstrumentType(type: InstrumentType) {
        var forcedInstruments = Object.keys(this.filter.instruments.states)
            .filter((x) => this.filter.instruments.states[x] == CheckboxState.Require)
            .map((x) => Session.instruments.current().find((instrument) => instrument.name == x));

        return !forcedInstruments.some((x) => x && x.type == type);
    }

    changeSorting(property: SortingProperties | null = null, direction: keyof typeof SortingDirections | null = null) {
        if (property) this.sortingProperty = property;
        if (direction) this.sortingDirection = direction;
        this.requestFullUpdate();
        this.dispatchEvent(
            new CustomEvent('sortingUpdated', {
                detail: {
                    property: this.sortingProperty,
                    direction: this.sortingDirection,
                },
            })
        );
    }
}
