using ObscuritasMediaManager.ClientInterop.Queries;
using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
public class InteropQueryResponse
{
    public required long Ticks { get; set; }
    public required InteropQuery Query { get; set; }
    public required ResponseStatus Status { get; set; }
    public required object? Result { get; set; }
    public required object? Request { get; set; }
    public string? Message { get; set; }
}

