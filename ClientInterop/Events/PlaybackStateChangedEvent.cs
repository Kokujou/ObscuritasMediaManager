using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class PlaybackStateChangedEvent(PlaybackState playbackState) : IInteropEvent
{
    public PlaybackState PlaybackState => playbackState;
    public InteropEvent Event => InteropEvent.PlaybackStateChanged;
}