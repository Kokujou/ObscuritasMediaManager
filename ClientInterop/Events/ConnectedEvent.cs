using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class ConnectedEvent(string _ = "") : IInteropEvent
{
    public PlaybackState PlaybackState { get; } = AudioService.Player.PlaybackState;
    public string? TrackPath { get; } = AudioService.TrackPath;
    public double Duration { get; } = AudioService.GetCurrentTrackDuration().TotalMilliseconds;
    public double Position { get; } = AudioService.GetCurrentTrackPosition().TotalMilliseconds;
    public double Volume { get; } = AudioService.Volume;
    public float[] VisualizationData { get; } = AudioService.VisualizationData;
    public InteropEvent Event => InteropEvent.Connected;
}