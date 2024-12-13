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

export const IconRegistry = {
    Cross: crossIcon(),
    Trash: trashIcon(),
    Arrow: arrowIcon(),
    Import: importIcon(),
    Plus: plusIcon(),
    Popup: popupIcon(),
    AddPlaylist: addPlaylistIcon(),
    BrowsePlaylist: browsePlaylistIcon(),
    DownloadPlaylist: downloadPlaylistIcon(),
    PlayPlaylist: playPlaylistIcon(),
    SavePlaylist: savePlaylistIcon(),
    ShufflePlaylist: shufflePlaylistIcon(),
    ChangeVolume: changeVolumeIcon(),
    FastForward: fastForwardIcon(),
    IncreaseVolume: increaseVolumeIcon(),
    Pause: pauseIcon(),
    Play: playIcon(),
    Clean: cleanIcon(),
    Lookup: lookupIcon(),
    Note: noteIcon(),
    Revert: revertIcon(),
    SaveTick: saveTickIcon(),
    Unset: unsetIcon(),
    SelectAll: selectAllIcon(),
    UnselectAll: unselectAllIcon(),
    Ascending: ascendingIcon(),
    Descending: descendingIcon(),
    Speech: speechIcon(),
    Globus: globusIcon(),
    Drag: dragIcon(),
    Drop: dropIcon(),
    Clipboard: clipboardIcon(),
    Edit: editIcon(),
    Repair: repairIcon(),
};

export const Icons = {} as typeof IconRegistry;
Object.keys(IconRegistry).forEach((x: keyof typeof IconRegistry) => (Icons[x] = x));

export function registerIcons() {
    return unsafeCSS(
        Object.keys(Icons)
            .map(
                (selector: keyof typeof Icons) =>
                    `[icon=${selector}] {
                        ${renderMaskImage(IconRegistry[selector])}
                    }`
            )
            .join('\n\n')
    );
}
