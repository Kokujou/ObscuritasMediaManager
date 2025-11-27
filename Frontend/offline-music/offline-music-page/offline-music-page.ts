import { customElement, property, state } from 'lit-element/decorators';
import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options';
import { LitElementBase } from '../../data/lit-element-base';
import { MusicSortingProperties, SortingProperties } from '../../data/music-sorting-properties';
import { SortingDirections } from '../../data/sorting-directions';
import { newGuid } from '../../extensions/crypto.extensions';
import { changePage } from '../../extensions/url.extension';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { CustomTooltip } from '../../native-components/custom-tooltip/custom-tooltip';
import { Mood, MusicModel, PlaylistModel } from '../../obscuritas-media-manager-backend-client';
import { MusicFilterService } from '../../services/music-filter.service';
import { OfflineMusicDetailsPage } from '../offline-music-details-page/offline-music-details-page';
import { OfflineMusicImportPage } from '../offline-music-import-page/offline-music-import-page';
import { OfflineSession } from '../session';
import { renderOfflineMusicPageStyles } from './offline-music-page.css';
import { renderOfflineMusicPagePortraitStyles } from './offline-music-page.css.portrait';
import { renderOfflineMusicPage } from './offline-music-page.html';

export const MusicCache = await caches.open('ObscuritasMediaManager.Music');

@customElement('offline-music-page')
export class OfflineMusicPage extends LitElementBase {
    public static isPage = true as const;
    public static pageName = 'Offline Musik' as const;

    public static readonly CacheKey = (hash: string) => `./track/hash/${hash}`;

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

    @state() protected declare sidebarFlipped: boolean;

    get paginatedPlaylists() {
        return this.filteredPlaylists.slice(0, 6 + 3 * this.currentPage);
    }

    get paginatedTracks() {
        var pageSize = 6 + 3 * this.currentPage - this.filteredPlaylists.length;
        if (pageSize < 0) pageSize = 0;
        return this.filteredTracks.slice(0, pageSize);
    }

    get filteredPlaylists() {
        var sorted = MusicFilterService.filterPlaylists(OfflineSession.playlists, this.filter);
        let sortingProperty = this.sortingProperty;
        if (sortingProperty in PlaylistModel) sorted = sorted.orderBy((x) => x[sortingProperty as keyof PlaylistModel]);
        if (this.sortingDirection == 'ascending') return sorted;
        return sorted.reverse();
    }

    get filteredTracks() {
        var sorted = MusicFilterService.filterTracks(this.cachedTracks, this.filter);
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

    get cachedTracks() {
        return OfflineSession.musicMetadata.filter((metadata) =>
            OfflineSession.trackUrls.some((url) => url.endsWith(metadata.hash))
        );
    }

    constructor() {
        super();
        CustomTooltip; // for whatever reason needed
        this.filter = new MusicFilterOptions();
        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
        this.currentPage = 1;
        this.selectedTracks = [];

        var localSearchString = localStorage.getItem(`offline-music.search`);
        if (localSearchString) this.filter = MusicFilterOptions.fromJSON(localSearchString);

        localSearchString = localStorage.getItem(`offline-music.sorting`);
        if (localSearchString) {
            var object = JSON.parse(localSearchString);
            this.sortingProperty = object.property;
            this.sortingDirection = object.direction;
        }
    }

    async connectedCallback() {
        super.connectedCallback();

        await OfflineSession.initialize();
        if (!OfflineSession.initialized) {
            changePage(OfflineMusicImportPage);
            return;
        }

        this.requestFullUpdate();
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
        localStorage.setItem(`offline-music.search`, JSON.stringify(this.filter));
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
        const playlistId = newGuid();
        OfflineSession.temporaryPlaylists[playlistId] = tracks.map((x) => x.hash);
        changePage(OfflineMusicDetailsPage, { playlistId });
    }

    async toggleTrack(track: MusicModel) {
        await OfflineSession.toggleTrack(track);

        this.requestFullUpdate();
    }
}
