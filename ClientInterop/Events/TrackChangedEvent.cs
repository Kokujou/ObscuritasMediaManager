using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class TrackChangedEvent(string trackPath, double duration) : InteropEventBase(InteropEvent.TrackChanged)
{
    public string TrackPath => trackPath;
    public double Duration => duration;
}