using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class TrackEndedEvent : IInteropEvent
{
    public InteropEvent Event => InteropEvent.TrackEnded;
}