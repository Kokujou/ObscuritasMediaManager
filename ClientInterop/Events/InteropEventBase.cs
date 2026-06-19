using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public abstract class InteropEventBase(InteropEvent e)
{
    public InteropEvent Event { get; } = e;
}