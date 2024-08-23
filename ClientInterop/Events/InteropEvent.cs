using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsEnum]
public enum InteropEvent
{
    TrackPositionChanged,
    TrackEnded,
    Connected,
    TrackChanged,
    PlaybackStateChanged,
    VolumeChanged
}