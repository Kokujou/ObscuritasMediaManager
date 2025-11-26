import { customElement, property, state } from 'lit-element/decorators';
import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options';
import { LitElementBase } from '../../data/lit-element-base';
import { MusicSortingProperties, SortingProperties } from '../../data/music-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { InstrumentModel, Mood, MusicModel, PlaylistModel } from '../../obscuritas-media-manager-backend-client';
import { IndexedDbService } from '../../services/indexed-db.service';
import { MusicFilterService } from '../../services/music-filter.service';
import { renderOfflineMusicPageStyles } from './offline-music-page.css';
import { renderOfflineMusicPagePortraitStyles } from './offline-music-page.css.portrait';
import { renderOfflineMusicPage } from './offline-music-page.html';

@customElement('offline-music-page')
export class OfflineMusicPage extends LitElementBase {
    public static readonly DbName = 'ObscuritasMediaManager.Music';
    public static readonly DbVersion = 1;
    public static readonly MusicStoreName = 'music';
    public static readonly PlaylistsStoreName = 'playlists';
    public static readonly InstrumentsStoreName = 'instruments';
    public static readonly StoreNames = [
        OfflineMusicPage.MusicStoreName,
        OfflineMusicPage.PlaylistsStoreName,
        OfflineMusicPage.InstrumentsStoreName,
    ];

    public static isPage = true as const;

    static override get styles() {
        return [renderOfflineMusicPageStyles(), renderOfflineMusicPagePortraitStyles()];
    }

    @property({ type: Boolean, reflect: true }) protected declare selectionMode: boolean;

    @state() public declare dataImported: boolean;
    @state() protected declare filter: MusicFilterOptions;
    @state() protected declare sortingProperty: SortingProperties;
    @state() protected declare sortingDirection: keyof typeof SortingDirections;
    @state() protected declare currentPage: number;

    @state() protected declare selectedTracks: MusicModel[];
    @state() protected declare selectionModeTimer: NodeJS.Timeout | null;
    @state() protected declare selectionModeSetByHash: string | null;

    @state() protected declare music: MusicModel[];
    @state() protected declare playlists: PlaylistModel[];
    @state() protected declare instruments: InstrumentModel[];

    @state() protected declare sidebarFlipped: boolean;

    protected declare database: IDBDatabase | null;

    get databaseConsistent() {
        if (!this.database) return false;
        return OfflineMusicPage.StoreNames.every((storeName) => this.database!.objectStoreNames.contains(storeName));
    }

    get paginatedPlaylists() {
        return this.filteredPlaylists.slice(0, 6 + 3 * this.currentPage);
    }

    get paginatedTracks() {
        var pageSize = 6 + 3 * this.currentPage - this.filteredPlaylists.length;
        if (pageSize < 0) pageSize = 0;
        return this.filteredTracks.slice(0, pageSize);
    }

    get filteredPlaylists() {
        var sorted = MusicFilterService.filterPlaylists(this.playlists, this.filter);
        let sortingProperty = this.sortingProperty;
        if (sortingProperty in PlaylistModel) sorted = sorted.orderBy((x) => x[sortingProperty as keyof PlaylistModel]);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    get filteredTracks() {
        var sorted = MusicFilterService.filterTracks(this.music, this.filter);
        if (this.sortingProperty == 'unset' && this.sortingDirection == 'ascending') return sorted;
        if (this.sortingProperty == 'unset') return sorted.reverse();

        const sortingProperty: (keyof MusicModel)[] = [this.sortingProperty];
        if (this.sortingProperty == 'mood1') sortingProperty.push('mood2');
        sorted = sorted.orderBy(
            ...sortingProperty.map(
                (property) => (x: MusicModel) =>
                    property == 'mood1' || property == 'mood2' ? Object.values(Mood).indexOf(x[property]) : x[property]
            )
        );
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    constructor() {
        super();
        this.filter = new MusicFilterOptions();
        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
        this.currentPage = 1;
        this.selectedTracks = [];

        this.music = [];
        this.playlists = [];
        this.instruments = [];

        var localSearchString = localStorage.getItem(`music.search`);
        if (localSearchString) this.filter = MusicFilterOptions.fromJSON(localSearchString);

        localSearchString = localStorage.getItem(`music.sorting`);
        if (localSearchString) {
            var object = JSON.parse(localSearchString);
            this.sortingProperty = object.property;
            this.sortingDirection = object.direction;
        }
    }

    async connectedCallback() {
        super.connectedCallback();

        setTimeout(() => {
            const video = this.shadowRoot?.querySelector('video');
            if (video) alert(JSON.stringify(video.readyState));
        }, 3000);

        this.database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
        if (!this.database || !this.databaseConsistent) {
            document.body.appendChild(document.createElement('offline-music-import-page'));
            this.remove();
            return;
        }

        this.music = await this.database.readStore<MusicModel>(OfflineMusicPage.MusicStoreName);
        this.playlists = await this.database.readStore<PlaylistModel>(OfflineMusicPage.PlaylistsStoreName);
        this.instruments = await this.database.readStore<InstrumentModel>(OfflineMusicPage.InstrumentsStoreName);

        if (this.music.length <= 0 || this.instruments.length <= 0) {
            document.body.appendChild(document.createElement('offline-music-import-page'));
            this.remove();
            return;
        }

        document.body.querySelector('loading-screen')?.remove();

        window.addEventListener('pointerdown', () => {
            if (!this.selectionMode || ContextMenu.instance) return;
            this.selectionMode = false;
            this.selectedTracks = [];
        });
    }

    override render() {
        return renderOfflineMusicPage.call(this);
    }

    loadNext() {
        this.currentPage++;
        this.requestFullUpdate();
    }

    startSelectionModeTimer(audioHash: string, event: PointerEvent) {
        event.stopPropagation();

        if (event.button != 0) return;
        if (this.selectionMode) return;
        this.selectionModeSetByHash = audioHash;
        this.selectionModeTimer = setTimeout(() => {
            this.selectionModeTimer = null;
            this.selectionMode = true;
            this.requestFullUpdate();
        }, 1000);
        this.requestFullUpdate();
    }

    stopSelectionModeTimer() {
        if (!this.selectionModeTimer) return;
        this.selectionModeSetByHash = null;
        clearTimeout(this.selectionModeTimer);
        this.requestFullUpdate();
    }

    toggleTrackSelection(track: MusicModel) {
        if (!this.selectedTracks.includes(track)) this.selectedTracks.push(track);
        else this.selectedTracks = this.selectedTracks.filter((x) => x != track);
        if (this.selectedTracks.length == 0) {
            this.selectionMode = false;
            this.selectedTracks = [];
        }

        this.requestFullUpdate();
    }

    updateFilter(filter: MusicFilterOptions) {
        this.filter = filter;
        localStorage.setItem(`music.search`, JSON.stringify(this.filter));
        this.requestFullUpdate();
    }

    updateSorting(sortingProperty: keyof typeof MusicSortingProperties, sortingDirection: keyof typeof SortingDirections) {
        this.sortingProperty = sortingProperty;
        this.sortingDirection = sortingDirection;
        localStorage.setItem(
            `music.sorting`,
            JSON.stringify({ property: this.sortingProperty, direction: this.sortingDirection })
        );
        this.requestFullUpdate();
    }

    async playPlaylist(tracks: MusicModel[]) {
        //fuck everything and use caching service :()
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        this.database?.close();
    }
}
