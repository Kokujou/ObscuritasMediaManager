using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Commands;

[ExportTsEnum]
public enum InteropCommand
{
    CopyAudioToClipboard,
    RequestFiles,
    RequestFolder,
    LoadTrack,
    ResumeTrack,
    PauseTrack,
    StopTrack,
    ChangeTrackPosition
}
