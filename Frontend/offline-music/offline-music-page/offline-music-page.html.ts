import { html } from 'lit';
import { MusicFilterOptions } from '../../advanced-components/music-filter/music-filter-options';
import { MusicSorting } from '../../advanced-components/music-filter/music-sorting';
import { changePage } from '../../extensions/url.extension';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { ClipboardService } from '../../services/clipboard.service';
import { OfflineMusicImportPage } from '../offline-music-import-page/offline-music-import-page';
import { OfflineSession } from '../session';
import { OfflineMusicPage } from './offline-music-page';

export function renderOfflineMusicPage(this: OfflineMusicPage) {
    const cachedTracks = this.getCachedTracks();
    const filteredPlaylists = this.getFilteredPlaylists();
    const paginatedPlaylists = this.getPaginatedPlaylists(filteredPlaylists);
    const filteredTracks = this.getFilteredTracks(cachedTracks);
    const paginatedTracks = this.getPaginatedTracks(filteredTracks, filteredPlaylists.length);

    return html`
        <link-element id="online-link" href="../#">Online-Version</link-element>
        <div id="music-page">
            <div id="search-panel-container" ?flipped="${this.sidebarFlipped}">
                <div id="draw-sidebar-icon" @click="${() => (this.sidebarFlipped = !this.sidebarFlipped)}">»</div>
                <music-filter
                    .filter="${this.filter}"
                    .sorting="${this.sorting}"
                    @filterChanged="${(e: CustomEvent<{ filter: MusicFilterOptions }>) => this.updateFilter(e.detail.filter)}"
                    @sortingUpdated="${(e: CustomEvent<MusicSorting>) => this.updateSorting(e.detail)}"
                    id="music-filter"
                ></music-filter>
                <div id="result-count-label">${filteredTracks.length} von ${cachedTracks.length} Musik-Tracks</div>
            </div>
            <div id="result-options-container" @pointerdown="${(e: Event) => e.stopPropagation()}">
                <div id="result-options">
                    <div class="option-section" id="playlist-section">
                        <a id="add-to-playlist" icon="${Icons.SavePlaylist}" tooltip="Zu einer Playlist hinzufügen"></a>
                        <a id="create-playlist" icon="${Icons.AddPlaylist}" tooltip="Playlist erstellen"></a>
                        <a
                            id="play-playlist"
                            icon="${Icons.PlayPlaylist}"
                            tooltip="Ausgewählte Tracks abspielen"
                            @click="${() => this.playPlaylist(this.selectionMode ? this.selectedTracks : filteredTracks)}"
                        ></a>
                    </div>

                    <div class="option-section">
                        <range-slider
                            @valueChanged="${(e: CustomEvent<{ value: string }>) =>
                                OfflineSession.changeVolume(Number.parseInt(e.detail.value) / 100)}"
                            step="1"
                            min="0"
                            max="100"
                            .value="${`${OfflineSession.audio.volume * 100}`}"
                        >
                        </range-slider>
                    </div>

                    <div class="option-section" id="playlist-section">
                        <a
                            id="sync"
                            icon="${Icons.Globus}"
                            tooltip="Synchronisieren"
                            @click="${() => changePage(OfflineMusicImportPage)}"
                        ></a>
                    </div>
                </div>
            </div>
            <paginated-scrolling
                id="search-results-container"
                scrollTopThreshold="50"
                @scroll="${() => this.stopSelectionModeTimer()}"
                @scrollBottom="${() => this.loadNext()}"
            >
                <div id="search-results">
                    ${paginatedPlaylists.map(
                        (playlist) =>
                            html`
                                <div class="audio-link-container" @click="${(e: Event) => e.stopPropagation()}">
                                    <playlist-tile
                                        .playlist="${playlist}"
                                        @click="${() => this.playPlaylist(playlist.tracks)}"
                                    ></playlist-tile>
                                </div>
                            `
                    )}
                    ${paginatedTracks.map(
                        (track) =>
                            html`
                                <div
                                    class="audio-link-container"
                                    @pointerdown="${(e: PointerEvent) => this.startSelectionModeTimer(track.hash, e)}"
                                    @pointerup="${(e: PointerEvent) => this.stopSelectionModeTimer()}"
                                    @pointerover="${(e: PointerEvent) =>
                                        this.selectionModeSetByHash != track.hash ? this.stopSelectionModeTimer() : null}"
                                    @click="${(e: Event) => {
                                        e.stopPropagation();
                                        this.toggleTrackSelection(track);
                                    }}"
                                >
                                    ${this.selectionMode
                                        ? html`<input
                                              type="checkbox"
                                              class="audio-select"
                                              ?checked="${this.selectedTracks.includes(track)}"
                                              @change="${() => this.toggleTrackSelection(track)}"
                                          />`
                                        : ''}
                                    <audio-tile
                                        .track="${track}"
                                        .visualizationData="${OfflineSession.visualizationData}"
                                        ?paused="${OfflineSession.audio.paused || OfflineSession.activeTrackHash != track.hash}"
                                        @musicToggled="${(e: Event) => this.toggleTrack(track, e)}"
                                        @clipboard="${() => ClipboardService.copyAudioToClipboard(track)}"
                                    ></audio-tile>
                                </div>
                            `
                    )}
                </div>
            </paginated-scrolling>
        </div>
    `;
}
