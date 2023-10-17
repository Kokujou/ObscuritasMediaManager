using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public class DynamicallyRenderedComponent
{
    public readonly Guid Id = Guid.NewGuid();
    public required Type ComponentType { get; set; }
    public Dictionary<string, object> Parameters { get; set; } = new();
    public DynamicComponent? Instance { get; set; }
}
