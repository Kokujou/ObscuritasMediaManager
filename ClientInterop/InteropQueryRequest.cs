using ObscuritasMediaManager.ClientInterop.Queries;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop;

[ExportTsClass]
public class InteropQueryRequest
{
    public required long Ticks { get; set; }
    public required InteropQuery Query { get; set; }
    [TsType(TsType.Any)] public JsonElement? Payload { get; set; }
}