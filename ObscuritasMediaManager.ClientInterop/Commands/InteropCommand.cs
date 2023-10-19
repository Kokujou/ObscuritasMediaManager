using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Commands;

[ExportTsEnum]
public enum InteropCommand
{
    CopyAudioToClipboard,
    ResumeTrack,
    PauseTrack,
    StopTrack,
    ChangeTrackPosition,
    ChangeTrackVolume
}
