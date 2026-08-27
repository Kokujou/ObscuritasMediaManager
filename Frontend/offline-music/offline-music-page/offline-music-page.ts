import { customElement, property, state } from 'lit-element/decorators';
import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options';
import { MusicSorting } from '../../advanced-components/music-filter/music-sorting';
import { LitElementBase } from '../../data/lit-element-base';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { newGuid } from '../../extensions/crypto.extensions';
import { changePage } from '../../extensions/url.extension';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { CustomTooltip } from '../../native-components/custom-tooltip/custom-tooltip';
import { MusicModel, PlaylistModel } from '../../obscuritas-media-manager-backend-client';
import { MusicFilterService } from '../../services/music-filter.service';
import { OfflineMusicDetailsPage } from '../offline-music-details-page/offline-music-details-page';
import { OfflineMusicImportPage } from '../offline-music-import-page/offline-music-import-page';
import { OfflineSession } from '../session';
import { renderOfflineMusicPageStyles } from './offline-music-page.css';
import { renderOfflineMusicPagePortraitStyles } from './offline-music-page.css.portrait';
import { renderOfflineMusicPage } from './offline-music-page.html';

@customElement('offline-music-page')
export class OfflineMusicPage extends LitElementBase {
    public static isPage = true as const;
    public static pageName = 'Offline Musik' as const;

    static override get styles() {
        return [renderOfflineMusicPageStyles(), renderOfflineMusicPagePortraitStyles()];
    }

    @property({ type: Boolean, reflect: true }) declare protected selectionMode: boolean;

    @state() declare public dataImported: boolean;
    @state() declare protected filter: MusicFilterOptions;
    @state() declare protected sorting: MusicSorting;
    @state() declare protected currentPage: number;

    @state() declare protected selectedTracks: MusicModel[];
    @state() declare protected selectionModeTimer: ReturnType<typeof setTimeout> | null;
    @state() declare protected selectionModeSetByHash: string | null;

    @state() declare protected sidebarFlipped: boolean;

    constructor() {
        super();
        CustomTooltip; // for whatever reason needed
        this.filter = new MusicFilterOptions();
        this.sorting = new MusicSorting();
        this.currentPage = 1;
        this.selectedTracks = [];

        var localSearchString = localStorage.getItem(`offline-music.search`);
        if (localSearchString) this.filter = MusicFilterOptions.fromJSON(localSearchString);

        localSearchString = localStorage.getItem(`offline-music.sorting`);
        if (localSearchString) this.sorting = JSON.parse(localSearchString);
    }

    async connectedCallback() {
        super.connectedCallback();

        await OfflineSession.initialize();
        if (!OfflineSession.initialized) {
            changePage(OfflineMusicImportPage);
            return;
        }

        this.requestFullUpdate();
        // both were added without a signal, so every page instance left one behind on document
        window.addEventListener(
            'pointerdown',
            () => {
                if (!this.selectionMode || ContextMenu.instance) return;
                this.selectionMode = false;
                this.selectedTracks = [];
            },
            { signal: this.abortController.signal },
        );
        document.addEventListener('visibilitychange', () => this.requestFullUpdate(), {
            signal: this.abortController.signal,
        });
    }

    override render() {
        return renderOfflineMusicPage.call(this);
    }

    getPaginatedPlaylists(playlists: PlaylistModel[]) {
        return playlists.slice(0, 6 + 3 * this.currentPage);
    }

    getPaginatedTracks(tracks: MusicModel[], offset: number) {
        var pageSize = 6 + 3 * this.currentPage - offset;
        if (pageSize < 0) pageSize = 0;
        return tracks.slice(0, pageSize);
    }

    getFilteredPlaylists() {
        return MusicFilterService.filterPlaylists(OfflineSession.playlists, this.filter, this.sorting);
    }

    getFilteredTracks(tracks: MusicModel[]) {
        return MusicFilterService.filterTracks(tracks, this.filter, this.sorting);
    }

    getCachedTracks() {
        const cached = new Set(OfflineSession.trackHashes);
        return OfflineSession.musicMetadata.filter((metadata) => cached.has(metadata.hash));
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
        this.selectionModeTimer = null;
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

    updateSorting(sorting: MusicSorting) {
        Object.assign(this.sorting, sorting);
        localStorage.setItem(`offline-music.sorting`, JSON.stringify(this.sorting));
        this.requestFullUpdate();
    }

    async playPlaylist(tracks: MusicModel[]) {
        const playlistId = newGuid();
        const cached = new Set(OfflineSession.trackHashes);
        const cachedHashes = tracks.map((x) => x.hash).filter((hash) => cached.has(hash));

        if (cachedHashes.length <= 0) {
            await DialogBase.show('Cache unvollständig', {
                content: 'Die ausgewählten Songs sind nicht im Cache vorhanden.',
                acceptActionText: 'Ok',
            });
            return;
        }

        if (
            cachedHashes.length < tracks.length &&
            !(await DialogBase.show('Cache unvollständig', {
                content:
                    'Einige Songs aus der Playlist sind noch nicht im Cache vorhanden.\r\n' +
                    'Möchtest du ohne diese Tracks fortfahren?',
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
            }))
        )
            return;

        OfflineSession.temporaryPlaylists[playlistId] = cachedHashes;
        changePage(OfflineMusicDetailsPage, { playlistId });
    }

    async toggleTrack(track: MusicModel) {
        try {
            await OfflineSession.playTrack(track);
        } catch (error) {
            console.error(error);
            await DialogBase.show('Track nicht abspielbar', {
                content: 'Dieser Track ist nicht im Offline-Cache oder beschädigt.',
                acceptActionText: 'Ok',
            });
        }

        this.requestFullUpdate();
    }
}
