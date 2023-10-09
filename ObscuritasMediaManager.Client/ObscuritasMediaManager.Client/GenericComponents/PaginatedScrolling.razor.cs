using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class PaginatedScrolling
{
    [Parameter] public int ScrollTopThreshold { get; set; } = 0;
    [Parameter] public EventCallback ScrollBottom { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public bool NoFade { get; set; }
    public required ElementReference ScrollContainer { get; set; }

    [JSInvokable]
    public async Task NotifyScrolledToBottomAsync()
    {
        await ScrollBottom.InvokeAsync();
    }

    public async Task ScrollToTopAsync()
    {
        await JS.InvokeVoidAsync("scrollToTop", ScrollContainer);
    }

    public async Task ScrollToChildAsync(ElementReference child)
    {
        await JS.InvokeVoidAsync("scrollToChild", ScrollContainer, child);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        base.OnAfterRender(firstRender);
        if (!firstRender) return;
        await JS.InvokeVoidAsync("attachScrollListener", DotNetObjectReference.Create(this), ScrollContainer, ScrollTopThreshold);
    }
}