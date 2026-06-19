using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class PlaybackStateChangedEvent(PlaybackState playbackState)
    : InteropEventBase(InteropEvent.PlaybackStateChanged)
{
    public PlaybackState PlaybackState => playbackState;
}