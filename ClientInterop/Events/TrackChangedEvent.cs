using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class TrackChangedEvent(string trackPath, double duration) : IInteropEvent
{
    public string TrackPath => trackPath;
    public double Duration => duration;
    public InteropEvent Event => InteropEvent.TrackChanged;
}