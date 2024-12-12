import { unsafeCSS } from 'lit-element';
import { clipboardIcon } from '../../advanced-components/upload-area/images/clipboard-icon.svg';
import { dropIcon } from '../../advanced-components/upload-area/images/drop-icon.svg';
import { editIcon } from '../../pages/media-detail-page/images/edit-icon.svg';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg';
import { renderMaskImage } from '../../services/extensions/style.extensions';
import { arrowIcon } from './general/arrow.svg';
import { ascendingIcon } from './general/ascending-icon.svg';
import { cleanIcon } from './general/clean-icon.svg';
import { crossIcon } from './general/cross-icon.svg';
import { descendingIcon } from './general/descending-icon.svg';
import { dragIcon } from './general/drag-icon.svg';
import { globusIcon } from './general/globus-icon.svg';
import { importIcon } from './general/import-icon.svg';
import { lookupIcon } from './general/lookup-icon.svg';
import { noteIcon } from './general/note-icon.svg';
import { plusIcon } from './general/plus-icon.svg';
import { popupIcon } from './general/popup-icon.svg';
import { repairIcon } from './general/repair-icon.svg';
import { revertIcon } from './general/revert-icon.svg';
import { saveTickIcon } from './general/save-tick-icon.svg';
import { selectAllIcon } from './general/select-all-icon.svg';
import { speechIcon } from './general/speech-icon.svg';
import { unselectAllIcon } from './general/unselect-all-icon.svg';
import { unsetIcon } from './general/unset-icon.svg';
import { changeVolumeIcon } from './music-player-icons/change-volume-icon.svg';
import { fastForwardIcon } from './music-player-icons/fast-forward-icon.svg';
import { increaseVolumeIcon } from './music-player-icons/increase-volume-icon.svg';
import { pauseIcon } from './music-player-icons/pause-icon.svg';
import { playIcon } from './music-player-icons/play-icon.svg';
import { addPlaylistIcon } from './playlist-icons/add-playlist-icon.svg';
import { browsePlaylistIcon } from './playlist-icons/browse-playlist-icon.svg';
import { downloadPlaylistIcon } from './playlist-icons/download-playlist-icon.svg';
import { playPlaylistIcon } from './playlist-icons/play-playlist-icon.svg';
import { savePlaylistIcon } from './playlist-icons/save-playlist-icon.svg';
import { shufflePlaylistIcon } from './playlist-icons/shuffle-playlist-icon.svg';

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
    static Lookup = lookupIcon();
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
    static Repair = repairIcon();
}

export const Icons = {} as typeof IconRegistry;
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
