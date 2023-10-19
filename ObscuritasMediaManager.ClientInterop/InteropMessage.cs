using ObscuritasMediaManager.ClientInterop.Commands;
using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop;

[ExportTsClass]
public class InteropMessage
{
    public InteropCommand Command { get; set; }
    public object? Payload { get; set; }
}
