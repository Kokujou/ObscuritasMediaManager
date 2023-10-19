using ObscuritasMediaManager.ClientInterop.Commands;
using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
public class InteropCommandResponse
{
    public required long Ticks { get; set; }
    public required InteropCommand Command { get; set; }
    public required ResponseStatus Status { get; set; }
    public string? Message { get; set; }
}

