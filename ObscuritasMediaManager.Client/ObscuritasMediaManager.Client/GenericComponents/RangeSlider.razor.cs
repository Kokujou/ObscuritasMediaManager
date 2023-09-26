using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class RangeSlider
{
    [Parameter] public int Min { get; set; } = 0;
    [Parameter] public int Max { get; set; } = 100;
    [Parameter] public int Step { get; set; } = 1;
    [Parameter] public int Value { get; set; } = 0;
    [Parameter] public EventCallback<int> ValueChanged { get; set; }
    [Parameter] public EventCallback<int> ValueFinalized { get; set; }
}