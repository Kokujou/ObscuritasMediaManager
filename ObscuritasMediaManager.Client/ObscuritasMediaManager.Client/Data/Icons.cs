using ObscuritasMediaManager.Client.Attributes;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public enum Icons
{
    [IconUrl("resources/inline-icons/playlist-icons/add-playlist-icon.svg")]
    AddPlaylist,
    [IconUrl("resources/inline-icons/playlist-icons/browse-playlist-icon.svg")]
    BrowsePlaylist,
    [IconUrl("resources/inline-icons/playlist-icons/download-playlist-icon.svg")]
    DownloadPlaylist,
    [IconUrl("resources/inline-icons/playlist-icons/playlist-icon.svg")]
    Playist,
    [IconUrl("resources/inline-icons/playlist-icons/play-playlist-icon.svg")]
    PlayPlaylist,
    [IconUrl("resources/inline-icons/playlist-icons/save-playlist-icon.svg")]
    SavePlaylist,
    [IconUrl("resources/inline-icons/playlist-icons/shuffle-playlist-icon.svg")]
    ShufflePlaylist,
    [IconUrl("resources/inline-icons/music-player-icons/pause-icon.svg")]
    Pause,
    [IconUrl("resources/inline-icons/music-player-icons/play-icon.svg")]
    Play,
    [IconUrl("resources/inline-icons/music-player-icons/change-volume-icon.svg")]
    ChangeVolume,
    [IconUrl("resources/inline-icons/music-player-icons/increase-volume-icon.svg")]
    IncreaseVolume,
    [IconUrl("resources/inline-icons/music-player-icons/fast-forward-icon.svg")]
    FastForward,
    [IconUrl("resources/inline-icons/general/unselect-icon.svg")]
    Unselect,
    [IconUrl("resources/inline-icons/general/unselect-all-icon.svg")]
    UnselectAll,
    [IconUrl("resources/inline-icons/general/speech-icon.svg")]
    Speech,
    [IconUrl("resources/inline-icons/general/select-all-icon.svg")]
    SelectAll,
    [IconUrl("resources/inline-icons/general/save-icon.svg")]
    Save,
    [IconUrl("resources/inline-icons/general/revert-icon.svg")]
    Revert,
    [IconUrl("resources/inline-icons/general/popup-icon.svg")]
    Popup,
    [IconUrl("resources/inline-icons/general/plus-icon.svg")]
    Plus,
    [IconUrl("resources/inline-icons/general/note-icon.svg")]
    Note,
    [IconUrl("resources/inline-icons/general/import-icon.svg")]
    Import,
    [IconUrl("resources/inline-icons/general/drag-icon.svg")]
    Drag,
    [IconUrl("resources/inline-icons/general/descending-icon.svg")]
    Descending,
    [IconUrl("resources/inline-icons/general/cross-icon.svg")]
    Cross,
    [IconUrl("resources/inline-icons/general/clean-icon.svg")]
    Clean,
    [IconUrl("resources/inline-icons/general/ascending-icon.svg")]
    Ascending,
    [IconUrl("resources/inline-icons/general/clipboard-icon.svg")]
    Clipboard,
    [IconUrl("resources/inline-icons/general/drop-icon.svg")]
    DropItem,
    [IconUrl("resources/inline-icons/general/edit-icon.svg")]
    Edit,
    [IconUrl("resources/inline-icons/general/trash-icon.svg")]
    Trash,
    [IconUrl("resources/inline-icons/general/arrow-icon.svg")]
    Arrow
}
