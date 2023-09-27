using ObscuritasMediaManager.Client.Attributes;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Data;

public enum Icons
{
    [IconUrl("resources/inline-icons/music-player-icons/pause-icon.svg")]
    Pause,
    [IconUrl("resources/inline-icons/music-player-icons/play-icon.svg")]
    Play,
    [IconUrl("resources/inline-icons/music-player-icons/unselect-icon.svg")]
    Unselect,
    [IconUrl("resources/inline-icons/music-player-icons/unselect-all-icon.svg")]
    UnselectAll,
    [IconUrl("resources/inline-icons/music-player-icons/speech-icon.svg")]
    Speech,
    [IconUrl("resources/inline-icons/music-player-icons/select-all-icon.svg")]
    SelectAll,
    [IconUrl("resources/inline-icons/music-player-icons/save-icon.svg")]
    Save,
    [IconUrl("resources/inline-icons/music-player-icons/revert-icon.svg")]
    Revert,
    [IconUrl("resources/inline-icons/music-player-icons/popup-icon.svg")]
    Popup,
    [IconUrl("resources/inline-icons/music-player-icons/plus-icon.svg")]
    Plus,
    [IconUrl("resources/inline-icons/music-player-icons/note-icon.svg")]
    Note,
    [IconUrl("resources/inline-icons/music-player-icons/import-icon.svg")]
    Import,
    [IconUrl("resources/inline-icons/music-player-icons/drag-icon.svg")]
    Drag,
    [IconUrl("resources/inline-icons/music-player-icons/descending-icon.svg")]
    Descending,
    [IconUrl("resources/inline-icons/music-player-icons/cross-icon.svg")]
    Cross,
    [IconUrl("resources/inline-icons/music-player-icons/clean-icon.svg")]
    Clean,
    [IconUrl("resources/inline-icons/music-player-icons/ascending-icon.svg")]
    Ascending,
    [IconUrl("resources/inline-icons/music-player-icons/arrow-icon.svg")]
    Arrow
}
