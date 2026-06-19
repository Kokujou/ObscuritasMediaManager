using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class VolumeChangedEvent(double volume) : InteropEventBase(InteropEvent.VolumeChanged)
{
    public double Volume => volume;
}