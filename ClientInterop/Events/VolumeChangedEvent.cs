using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class VolumeChangedEvent(double volume) : IInteropEvent
{
    public double Volume => volume;
    public InteropEvent Event => InteropEvent.VolumeChanged;
}