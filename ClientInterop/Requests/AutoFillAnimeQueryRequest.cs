using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Requests;

[ExportTsClass]
public class AutoFillAnimeQueryRequest
{
    public required string Name { get; set; }
    public bool IsMovie { get; set; }
}