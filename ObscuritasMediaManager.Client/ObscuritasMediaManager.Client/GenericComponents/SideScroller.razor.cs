using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class SideScroller
{
    [Parameter] public RenderFragment? ChildContent { get; set; }

    private bool canScrollLeft => true;

    private bool canScrollRight => true;

    public void scrollToLeft()
    { }

    public void scrollToRight() { }
}