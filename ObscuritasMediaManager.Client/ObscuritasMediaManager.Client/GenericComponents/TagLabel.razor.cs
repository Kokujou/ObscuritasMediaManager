using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class TagLabel
{
    [Parameter] public string Text { get; set; } = string.Empty;
    [Parameter] public IEnumerable<string> Autocomplete { get; set; } = new List<string>();
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public bool CreateNew { get; set; }
    [Parameter] public EventCallback<string> TagCreated { get; set; }
    [Parameter] public EventCallback Removed { get; set; }
}
