using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsInterface]
public interface IInteropEvent
{
    InteropEvent Event { get; }
}