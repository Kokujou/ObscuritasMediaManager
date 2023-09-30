using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class SideScroller
{
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public bool CanScrollLeft { get; set; }
    [Parameter] public bool CanScrollRight { get; set; }
    [Parameter] public EventCallback<Direction> Scroll { get; set; }

    public enum Direction
    {
        Left,
        Right,
    }
}