using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class RangeSelector
{
    [Parameter] public int Min { get; set; }
    [Parameter] public int Max { get; set; }
    [Parameter] public int Left { get; set; }
    [Parameter] public int Right { get; set; }
    [Parameter] public EventCallback<(int left, int right)> RangeChanged { get; set; }
}
