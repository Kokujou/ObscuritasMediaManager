using ObscuritasMediaManager.ClientInterop.Commands;
using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop;

[ExportTsClass]
public class InteropCommandRequest
{
    public required long Ticks { get; set; }
    public required InteropCommand Command { get; set; }
    [TsType(TsType.Any)] public JsonElement? Payload { get; set; }
}
