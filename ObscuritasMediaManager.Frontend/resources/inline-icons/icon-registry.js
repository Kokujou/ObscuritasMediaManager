import { clipboardIcon } from '../../advanced-components/upload-area/images/clipboard-icon.svg.js';
import { dropIcon } from '../../advanced-components/upload-area/images/drop-icon.svg.js';
import { unsafeCSS } from '../../exports.js';
import { editIcon } from '../../pages/media-detail-page/images/edit-icon.svg.js';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { arrowIcon } from './general/arrow.svg.js';
import { ascendingIcon } from './general/ascending-icon.svg.js';
import { cleanIcon } from './general/clean-icon.svg.js';
import { crossIcon } from './general/cross-icon.svg.js';
import { descendingIcon } from './general/descending-icon.svg.js';
import { dragIcon } from './general/drag-icon.svg.js';
import { globusIcon } from './general/globus-icon.svg.js';
import { importIcon } from './general/import-icon.svg.js';
import { noteIcon } from './general/note-icon.svg.js';
import { plusIcon } from './general/plus-icon.svg.js';
import { popupIcon } from './general/popup-icon.svg.js';
import { revertIcon } from './general/revert-icon.svg.js';
import { saveTickIcon } from './general/save-tick-icon.svg.js';
import { selectAllIcon } from './general/select-all-icon.svg.js';
import { speechIcon } from './general/speech-icon.svg.js';
import { unselectAllIcon } from './general/unselect-all-icon.svg.js';
import { unsetIcon } from './general/unset-icon.svg.js';
import { changeVolumeIcon } from './music-player-icons/change-volume-icon.svg.js';
import { fastForwardIcon } from './music-player-icons/fast-forward-icon.svg.js';
import { increaseVolumeIcon } from './music-player-icons/increase-volume-icon.svg.js';
import { pauseIcon } from './music-player-icons/pause-icon.svg.js';
import { playIcon } from './music-player-icons/play-icon.svg.js';
import { addPlaylistIcon } from './playlist-icons/add-playlist-icon.svg.js';
import { browsePlaylistIcon } from './playlist-icons/browse-playlist-icon.svg.js';
import { downloadPlaylistIcon } from './playlist-icons/download-playlist-icon.svg.js';
import { playPlaylistIcon } from './playlist-icons/play-playlist-icon.svg.js';
import { savePlaylistIcon } from './playlist-icons/save-playlist-icon.svg.js';
import { shufflePlaylistIcon } from './playlist-icons/shuffle-playlist-icon.svg.js';

class IconRegistry {
    static Cross = crossIcon();
    static Trash = trashIcon();
    static Arrow = arrowIcon();
    static Import = importIcon();
    static Plus = plusIcon();
    static Popup = popupIcon();
    static AddPlaylist = addPlaylistIcon();
    static BrowsePlaylist = browsePlaylistIcon();
    static DownloadPlaylist = downloadPlaylistIcon();
    static PlayPlaylist = playPlaylistIcon();
    static SavePlaylist = savePlaylistIcon();
    static ShufflePlaylist = shufflePlaylistIcon();
    static ChangeVolume = changeVolumeIcon();
    static FastForward = fastForwardIcon();
    static IncreaseVolume = increaseVolumeIcon();
    static Pause = pauseIcon();
    static Play = playIcon();
    static Clean = cleanIcon();
    static Note = noteIcon();
    static Revert = revertIcon();
    static SaveTick = saveTickIcon();
    static Unset = unsetIcon();
    static SelectAll = selectAllIcon();
    static UnselectAll = unselectAllIcon();
    static Ascending = ascendingIcon();
    static Descending = descendingIcon();
    static Speech = speechIcon();
    static Globus = globusIcon();
    static Drag = dragIcon();
    static Drop = dropIcon();
    static Clipboard = clipboardIcon();
    static Edit = editIcon();
}

export const Icons = /** @type {typeof IconRegistry} */ ({});
Object.keys(IconRegistry).forEach((x) => (Icons[x] = x));

export function registerIcons() {
    return unsafeCSS(
        Object.keys(Icons)
            .map(
                (selector) =>
                    `[icon=${selector}] {
                        ${renderMaskImage(IconRegistry[selector])}
                    }`
            )
            .join('\n\n')
    );
}
