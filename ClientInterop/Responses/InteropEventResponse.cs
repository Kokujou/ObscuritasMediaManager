using ObscuritasMediaManager.ClientInterop.Evemts;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
public class InteropEventResponse
{
    public required InteropEvent Event { get; set; }
    public required object? Payload { get; set; }
}