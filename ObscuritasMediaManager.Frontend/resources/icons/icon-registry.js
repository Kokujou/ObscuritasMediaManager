import { unsafeCSS } from '../../exports.js';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { arrowIcon } from './arrow.svg.js';
import { ascendingIcon } from './general/ascending-icon.svg.js';
import { cleanIcon } from './general/clean-icon.svg.js';
import { descendingIcon } from './general/descending-icon.svg.js';
import { noteIcon } from './general/note-icon.svg.js';
import { revertIcon } from './general/revert-icon.svg.js';
import { saveTickIcon } from './general/save-tick-icon.svg.js';
import { selectAllIcon } from './general/select-all-icon.svg.js';
import { unselectAllIcon } from './general/unselect-all-icon.svg.js';
import { unsetIcon } from './general/unset-icon.svg.js';
import { importIcon } from './import-icon.svg.js';
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
import { plusIcon } from './plus-icon.svg.js';
import { popupIcon } from './popup-icon.svg.js';

class IconRegistryEntry {
    name;
    icon;

    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
    }

    toString() {
        return this.name;
    }
}

export class IconRegistry {
    static TrashIcon = new IconRegistryEntry('TrashIcon', trashIcon);
    static ArrowIcon = new IconRegistryEntry('ArrowIcon', arrowIcon);
    static ImportIcon = new IconRegistryEntry('ImportIcon', importIcon);
    static PlusIcon = new IconRegistryEntry('PlusIcon', plusIcon);
    static PopupIcon = new IconRegistryEntry('PopupIcon', popupIcon);
    static AddPlaylistIcon = new IconRegistryEntry('AddPlaylistIcon', addPlaylistIcon);
    static BrowsePlaylistIcon = new IconRegistryEntry('BrowsePlaylistIcon', browsePlaylistIcon);
    static DownloadPlaylistIcon = new IconRegistryEntry('DownloadPlaylistIcon', downloadPlaylistIcon);
    static PlayPlaylistIcon = new IconRegistryEntry('PlayPlaylistIcon', playPlaylistIcon);
    static SavePlaylistIcon = new IconRegistryEntry('SavePlaylistIcon', savePlaylistIcon);
    static ShufflePlaylistIcon = new IconRegistryEntry('ShufflePlaylistIcon', shufflePlaylistIcon);
    static ChangeVolumeIcon = new IconRegistryEntry('ChangeVolumeIcon', changeVolumeIcon);
    static FastForwardIcon = new IconRegistryEntry('FastForwardIcon', fastForwardIcon);
    static IncreaseVolumeIcon = new IconRegistryEntry('IncreaseVolumeIcon', increaseVolumeIcon);
    static PauseIcon = new IconRegistryEntry('PauseIcon', pauseIcon);
    static PlayIcon = new IconRegistryEntry('PlayIcon', playIcon);
    static CleanIcon = new IconRegistryEntry('CleanIcon', cleanIcon);
    static NoteIcon = new IconRegistryEntry('NoteIcon', noteIcon);
    static RevertIcon = new IconRegistryEntry('RevertIcon', revertIcon);
    static SaveTickIcon = new IconRegistryEntry('SaveTickIcon', saveTickIcon);
    static UnsetIcon = new IconRegistryEntry('UnsetIcon', unsetIcon);
    static SelectAllIcon = new IconRegistryEntry('SelectAllIcon', selectAllIcon);
    static UnselectAllIcon = new IconRegistryEntry('UnselectAllIcon', unselectAllIcon);
    static AscendingIcon = new IconRegistryEntry('AscendingIcon', ascendingIcon);
    static DescendingIcon = new IconRegistryEntry('DescendingIcon', descendingIcon);

    /** @access private */ constructor() {}
}

export function registerIcons() {
    return unsafeCSS(
        Object.keys(IconRegistry)
            .map(
                (selector) =>
                    `.${selector} {
                        ${renderMaskImage(IconRegistry[selector].icon())}
                    }`
            )
            .join('\n')
    );
}
