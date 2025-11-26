import { customElement, property, state } from 'lit-element/decorators';
import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options';
import { LitElementBase } from '../../data/lit-element-base';
import { MusicSortingProperties, SortingProperties } from '../../data/music-sorting-properties';
import { Observable } from '../../data/observable';
import { SortingDirections } from '../../data/sorting-directions';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { CustomTooltip } from '../../native-components/custom-tooltip/custom-tooltip';
import { InstrumentModel, Mood, MusicModel, PlaylistModel } from '../../obscuritas-media-manager-backend-client';
import { IndexedDbService } from '../../services/indexed-db.service';
import { MusicFilterService } from '../../services/music-filter.service';
import { OfflineMusicImportPage } from '../offline-music-import-page/offline-music-import-page';
import { renderOfflineMusicPageStyles } from './offline-music-page.css';
import { renderOfflineMusicPagePortraitStyles } from './offline-music-page.css.portrait';
import { renderOfflineMusicPage } from './offline-music-page.html';

@customElement('offline-music-page')
export class OfflineMusicPage extends LitElementBase {
    public static readonly CacheName = 'ObscuritasMediaManager.Music';
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

    @state() protected declare musicMetadata: MusicModel[];
    @state() protected declare playlists: PlaylistModel[];
    @state() protected declare instruments: InstrumentModel[];
    @state() protected declare trackUrls: string[];

    @state() protected declare sidebarFlipped: boolean;

    protected declare database: IDBDatabase | null;
    protected declare cache: Cache;
    protected declare playedTracks: Record<string, string>;

    protected declare audioElement: HTMLAudioElement;
    protected visualizationData = new Observable<Float32Array<ArrayBuffer>>(new Float32Array());

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
        return this.musicMetadata.filter((metadata) => this.trackUrls.some((url) => url.endsWith(metadata.hash)));
    }

    constructor() {
        super();
        CustomTooltip; // for whatever reason needed
        this.filter = new MusicFilterOptions();
        this.sortingProperty = 'unset';
        this.sortingDirection = 'ascending';
        this.currentPage = 1;
        this.selectedTracks = [];
        this.trackUrls = [];
        this.playedTracks = {};

        this.musicMetadata = [];
        this.playlists = [];
        this.instruments = [];

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

        this.audioElement = document.body.querySelector('audio') ?? document.body.appendChild(document.createElement('audio'));
        var localStorageVolume = localStorage.getItem('volume');
        if (localStorageVolume) this.changeVolume(Number.parseInt(localStorageVolume) / 100);
        this.setupAudio();

        setTimeout(() => {
            const video = this.shadowRoot?.querySelector('video');
            if (video) alert(JSON.stringify(video.readyState));
        }, 3000);

        this.database = await IndexedDbService.openDatabase(OfflineMusicPage.DbName, OfflineMusicPage.DbVersion);
        if (!this.database || !(await OfflineMusicImportPage.checkDataExists(this.database))) {
            document.body.appendChild(document.createElement('offline-music-import-page'));
            this.remove();
            return;
        }

        this.cache = await caches.open(OfflineMusicPage.CacheName);

        this.musicMetadata = await this.database.readStore<MusicModel>(OfflineMusicPage.MusicStoreName);
        this.playlists = await this.database.readStore<PlaylistModel>(OfflineMusicPage.PlaylistsStoreName);
        this.instruments = await this.database.readStore<InstrumentModel>(OfflineMusicPage.InstrumentsStoreName);
        this.trackUrls = (await this.cache.keys()).map((x) => x.url);

        if (this.musicMetadata.length <= 0 || this.instruments.length <= 0) {
            this.showImportPage();
            return;
        }

        document.body.querySelector('loading-screen')?.remove();

        this.requestFullUpdate();
        window.addEventListener('pointerdown', () => {
            if (!this.selectionMode || ContextMenu.instance) return;
            this.selectionMode = false;
            this.selectedTracks = [];
        });
    }

    async setupAudio() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.audioWorklet.addModule('processor.js');
        const track = audioContext.createMediaElementSource(this.audioElement);
        const workletNode = new AudioWorkletNode(audioContext, 'sample-processor');
        track.connect(workletNode).connect(audioContext.destination);

        workletNode.port.onmessage = (event) => {
            const samples = event.data as Float32Array<ArrayBuffer>;

            this.visualizationData.next(samples.map((sample) => sample / this.audioElement.volume));
        };

        // Start AudioContext auf User Interaction (iOS erfordert Interaktion)
        this.audioElement.addEventListener('play', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        });
    }

    showImportPage() {
        document.body.appendChild(document.createElement('offline-music-import-page'));
        this.remove();
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
        //fuck everything and use caching service :()
    }

    async toggleTrack(track: MusicModel) {
        let source = this.playedTracks[track.hash];
        if (!source) {
            const response = await this.cache.match(OfflineMusicPage.CacheKey(track.hash));
            if (!response) {
                alert('corrupt cache!');
                throw new Error('corrupt cache');
            }

            const blob = await response.blob();
            source = URL.createObjectURL(blob);
            this.playedTracks[track.hash] = source;
        }

        if (this.audioElement.src != source) {
            this.audioElement.pause();
            this.audioElement.src = source;
        }

        if (this.audioElement.paused) this.audioElement.play();
        else this.audioElement.pause();

        this.requestFullUpdate();
    }

    changeVolume(volume: number) {
        this.audioElement.volume = volume;
        localStorage.setItem('volume', `${volume * 100}`);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();

        this.database?.close();
    }
}
