using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class PaginatedScrolling
{
    [Parameter] public int ScrollTopThreshold { get; set; } = 0;
    [Parameter] public EventCallback ScrollBottom { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
}