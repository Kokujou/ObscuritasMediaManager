import { customElement, property } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { FilterEntry } from '../../data/filter-entry';
import { LitElementBase } from '../../data/lit-element-base';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog';
import { KeyOfType } from '../../services/object-filter.service';
import { MediaFilter } from './media-filter';
import { renderMediaFilterSidebarStyles } from './media-filter-sidebar.css';
import { renderMediaFilterSidebar } from './media-filter-sidebar.html';

@customElement('media-filter-sidebar')
export class MediaFilterSidebar extends LitElementBase {
    static override get styles() {
        return renderMediaFilterSidebarStyles();
    }

    static get properties() {
        return {
            filter: { type: Object, reflect: true },
        };
    }

    @property({ type: Object }) filter = new MediaFilter([]);

    override render() {
        return renderMediaFilterSidebar.call(this);
    }

    changeFilterProperty<T extends keyof MediaFilter>(property: T, value: (typeof MediaFilter.prototype)[T]) {
        this.filter[property] = value;
        this.notifyFilterUpdated();
    }

    setFilterProperty<T extends KeyOfType<MediaFilter, FilterEntry<any>>>(
        property: T,
        key: keyof MediaFilter[T]['states'] & (string | number | symbol),
        value: CheckboxState
    ) {
        var newFilter = this.filter[property];
        newFilter.setKey(key as never, value);
        this.changeFilterProperty(property, newFilter);
    }

    setArrayFilter<U extends MediaFilter[T]['keyType'], T extends KeyOfType<MediaFilter, FilterEntry<any>>>(
        property: T,
        keys: U[] | 'all',
        value: CheckboxState
    ) {
        var filter = this.filter[property];
        if (keys == 'all') for (let key in filter) filter.setKey(key as never, value);
        else for (let key of keys) filter.setKey(key as never, value);
        this.notifyFilterUpdated();
    }

    resetFilter() {
        var newFilter = new MediaFilter(Object.keys(this.filter.genres.states));
        //@ts-ignore
        for (let prop in newFilter) this.filter[prop] = newFilter[prop];
        this.notifyFilterUpdated();
    }

    notifyFilterUpdated() {
        this.requestFullUpdate();
        this.dispatchEvent(new Event('change', { composed: true }));
        localStorage.setItem(`media.search`, JSON.stringify(this.filter));
    }

    async openGenreDialog() {
        var dialog = await GenreDialog.startShowingWithGenres(this.filter.genres);
        dialog.addEventListener('accept', (e: CustomEvent<GenreDialogResult>) => {
            var acceptedGenreIds = e.detail.acceptedGenres.map((x) => x.id);
            var forbiddendGenreIds = e.detail.forbiddenGenres.map((x) => x.id);
            this.setArrayFilter('genres', 'all', CheckboxState.Ignore);
            this.setArrayFilter('genres', acceptedGenreIds, CheckboxState.Require);
            this.setArrayFilter('genres', forbiddendGenreIds, CheckboxState.Forbid);
            this.notifyFilterUpdated();
            dialog.remove();
        });
    }
}
