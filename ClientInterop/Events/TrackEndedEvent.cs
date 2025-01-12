using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class TrackEndedEvent(string _ = "") : IInteropEvent
{
    public InteropEvent Event => InteropEvent.TrackEnded;
}